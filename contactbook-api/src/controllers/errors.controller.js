const ApiError = require('../api-error');
const JSend = require('../jsend');
function methodNotAllowed(req, res, next) {
    if (req.route) {
        // Determine which HTTP methods are supported
        const httpMethods = Object.keys(req.route.methods)
        .filter((method) => method !== '_all')
        .map((method) => method.toUpperCase());
        return next(
            new ApiError(405, 'Method Not Allowed', {
            Allow: httpMethods.join(', '),
            })
        );
    }
    return next();
}
function resourceNotFound(req, res, next) {
    // Handler for unknown URL path.
    // Call next() to pass to the error handling function.
    return next(new ApiError(404, 'Resource not found'));
}
function handleError(error, req, res, next) {
    // The centralized error handling function.
    // In any route handler, calling next(error)
    // will pass to this error handling function.
    if (res.headersSent) {
        return next(error);
    }
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    return res
    .status(statusCode)
    .set(error.headers || {})
    .json(
        statusCode >= 500 ? JSend.error(message) : JSend.fail(message)
    );
}

function handleError(error, req, res, next) {
    // Hàm xử lý lỗi tập trung.
    if (res.headersSent) {
        return next(error);
    }

    // Kiểm tra và gán mã lỗi tùy thuộc vào loại lỗi
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Xử lý lỗi 400 và 404
    if (error.name === 'ValidationError' || error.type === 'entity.parse.failed') {
        statusCode = 400; // Bad Request
        message = 'Bad Request - Invalid input or request';
    } else if (error.name === 'NotFoundError') {
        statusCode = 404; // Not Found
        message = 'Resource not found';
    }

    return res
        .status(statusCode)
        .set(error.headers || {})
        .json(
            statusCode >= 500 ? JSend.error(message) : JSend.fail(message)
        );
}


module.exports = {
    methodNotAllowed,
    resourceNotFound,
    handleError,
};