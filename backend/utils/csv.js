const escapeCsvValue = (value) => {
    const stringValue = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

const buildCsv = (headers, rows) => {
    const lines = [
        headers.map((header) => escapeCsvValue(header.label)).join(','),
        ...rows.map((row) =>
            headers.map((header) => escapeCsvValue(row[header.key])).join(',')
        ),
    ];

    return lines.join('\n');
};

const sendCsv = (res, filename, headers, rows) => {
    const csv = buildCsv(headers, rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
};

module.exports = {
    buildCsv,
    sendCsv,
};
