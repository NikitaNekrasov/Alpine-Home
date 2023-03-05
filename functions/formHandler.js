const { connect } = require("../utils/database")
const busboy = require('busboy');
const { Readable } = require('stream')
const csv = require('csv-parser')

function parseMultipartForm(event) {
  return new Promise((resolve) => {
    // we'll store all form fields inside of this
    const fields = {}

    // let's instantiate our busboy instance!
    const bb = busboy({
      // it uses request headers
      // to extract the form boundary value (the ----WebKitFormBoundary thing)
      headers: event.headers
    })

    // before parsing anything, we need to set up some handlers.
    // whenever busboy comes across a file ...
    bb.on(
      "file",
      (fieldname, filestream, filename, transferEncoding, mimeType) => {
        // ... we take a look at the file's data ...
        filestream.on("data", (data) => {
          // ... and write the file's name, type and content into `fields`.
          fields[fieldname] = {
            filename,
            type: mimeType,
            content: data,
          }
        })
      }
    )

    // whenever busboy comes across a normal field ...
    bb.on("field", (fieldName, value) => {
      // ... we write its value into `fields`.
      fields[fieldName] = value
    })

    // once busboy is finished, we resolve the promise with the resulted fields.
    bb.on("close", () => {
      resolve(fields)
    })

    // now that all handlers are set up, we can finally start processing our request!
    bb.end(Buffer.from(event.body, 'base64'))
  });
}

function parseCsv(stream) {
  return new Promise((resolve) => {
    const orders = [];
    stream
      .pipe(csv())
      .on('data', (data) => orders.push(data))
      .on('end', () => {
        resolve(orders)
      })
  });
}

exports.handler = async (event, context, callback) => {
    const fields = await parseMultipartForm(event)
    const { db } = await connect();
    const stream = Readable.from(fields.file.content)
    const orders = await parseCsv(stream)

    const doc = {
      vendorName: fields.vendorName,
      orderDetails: orders,
      orderPlacedAt: new Date(fields.date),
      createdAt: new Date(),
    }
    await db.collection("orders").insertOne(doc);

    return {
        statusCode: 200,
    }
}