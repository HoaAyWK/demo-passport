const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Point = require("../models/Point");

exports.checkout = async (req, res, next) => {
    console.log(req.user);
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: `${process.env.BASE_CLIENT_URL}/checkout/success`,
            cancel_url: `${process.env.BASE_CLIENT_URL}/checkout/cancel`,
            payment_method_types: ["card"],
            line_items: [
                { 
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: "test"
                        },
                        unit_amount: 2000
                    },
                    quantity: 1
                 }
            ],
            metadata: {
                "user_id": req.user.id
            }
        });

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }      
};

exports.webhook = async (req, res, next) => {
    let event = req.body;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (webhookSecret) {
        const signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                webhookSecret
            );

        } catch (error) {
            console.log(`⚠️  Webhook signature verification failed.`, error.message);
            return res.status(400).json("error");
        }
    }

    switch (event.type) {
        case "checkout.session.completed":
            const userId = event.data.object.metadata.user_id;
            const point = await Point.findOne({ user: userId });
            point.amount += 20;
            await point.save();
            break;
        case "invoice.paid":
            console.log("invoice paid");
            break;
        case "invoice.payment_failed":
            console.log("payment failed")
            break;
        default: 
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200);
};