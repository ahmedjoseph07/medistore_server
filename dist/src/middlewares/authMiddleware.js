import { auth as betterAuth } from "../lib/auth.js";
export var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["SELLER"] = "SELLER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
export const authMiddleware = (...roles) => {
    return async (req, res, next) => {
        const session = await betterAuth.api.getSession({
            headers: req.headers
        });
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized"
            });
        }
        if (!session.user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: "Email verification required"
            });
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            emailVerified: session.user.emailVerified
        };
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access to this resource"
            });
        }
        next();
    };
};
