module.exports = (req, res, context, result) => {
    result = typeof result === 'number'
        ? result.toString()
        : result;

    if (!context || !context.meta)
        return res.send(result);

    res.statusCode = context.meta.HTTP.statusCode;
    const headers = context.meta.HTTP.headers;

    for (let header in headers)
        if (headers.hasOwnProperty(header))
            res.header(header, headers[header]);

    if (context.meta.HTTP.statusCode === 204)
        return res.send();

    return context.meta.path
        ? res.download(context.meta.path)
        : res.send(result);
};
