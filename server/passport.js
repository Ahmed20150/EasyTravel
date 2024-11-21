// import { ExtractJwt, Strategy } from "passport-jwt";
// import passport from "passport";
// import User, { Attendee, Organizer, Event, QRCode } from './userModel.js';


// const opts = {
//     jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: "secret",
// };

// const passportFunction = passport.use(
//     new Strategy(opts, async (payload, done) => {
//         try {
//             const foundUser = await Attendee.findById(payload.id);
//             if (foundUser) return done(null, foundUser);
//         } catch (error) {
//             return done(error);
//         }
//     })
// );

// export default passportFunction;

