const Invoice = require("../models/invoice.model");
const User = require("../models/user.model");
const Client = require("../models/client.model");
const InvoiceResponse = require("../middlewares/helpers/responses/invoice.response");
const UserResponse = require("../middlewares/helpers/responses/user.response");
const errorCodes = require("../middlewares/enums/errorCodes.enum");
const {invoiceRefGenerator} = require("../middlewares/utils/char.generator");
const {messagingService} = require('../middlewares/services/messageing.service')

const getInvoice = (req, res) => {
  Invoice.findAll()
    .then(invoices => {
      const response = InvoiceResponse.getInvoiceResponse();
      res.status(response.status).json({data: invoices, status: response.type, message: response.message});
    })
    .catch((error) => {
      const response = error.errors[0]
      res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: response.message});
    });
};

const createInvoice = async (req, res) => {
  try {
    await User.findByPk(req.body.userId).then(async user => {
      if (!user) {
        const response = UserResponse.getUserError('User does not Exist!');
        return res.status(response.status).json({status: response.type, message: response.message});
      }
      await Client.findByPk(req.body.clientId).then(async client => {
        if (!client) {
          return res.status(errorCodes.Error400.code).json({
            status: errorCodes.Error400.type,
            message: 'Client does not exist'
          });
        }
        const invoiceRef = invoiceRefGenerator(client.organization.replace(/\s+/g, ''));
        const reqBody = {
          invoiceRef: invoiceRef,
          is_paid: false,
          discount: req.body['discount'],
          charge: req.body['charge'],
          balance: req.body['balance'],
          userId: user.id,
          clientId: client.id
        };

        Invoice.create(reqBody).then(async invoice => {
          const response = InvoiceResponse.createInvoiceResponse();
          const dataObject = {
            sender: {
              firstName: user['firstName'],
              lastName: user['lastName'],
              email: user['email'],
              phone: user['phone']
            },
            receiver: {
              firstName: client['firstName'],
              lastName: client['lastName'],
              email: client['email'],
              phone: client['phone']
            },
            subject: `Payment Reminder: Invoice (${invoice['invoiceRef']})`
          };
          const invoiceObject = {
            invoiceRef: invoice['invoiceRef'],
            charge: invoice['charge'],
            discount: invoice['discount'],
            balance: invoice['balance'],
            payableFrom: client['organization'],
            datePayable: new Date(new Date() + 7 * 24*60*60*1000)
          };

          await messagingService(invoiceObject, dataObject);
          res.status(response.status).json({data: invoice, status: response.type, message: response.message});
        });
      })
    })
  } catch (e) {
    res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: 'Invalid User or Client Id'});
  }
};

const getInvoiceById = (req, res) => {
  Invoice.findByPk(req.params['id']).then(invoice => {
    const response = InvoiceResponse.getInvoiceResponse();
    res.status(response.status).json({data: invoice, status: response.type, message: response.message});
  }).catch(error => {
    const response = error.errors[0]
    res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: response.message});
  })
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.update(req.body, {
      where: {id: req.params['id']}
    });
    if (!invoice) {
      res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: ''});
    } else {
      const response = InvoiceResponse.getInvoiceResponse();
      res.status(response.status).json({
        data: await Invoice.findByPk(req.params['id']),
        status: response.type,
        message: response.message
      });
    }
  } catch (e) {
    const response = e.errors[0]
    res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: response.message});
  }
};

const deleteInvoice = (req, res) => {
  Invoice.findByPk(req.params['id']).then(async invoice => {
    await Invoice.destroy({
      where: {id: invoice.id}
    });
    const response = InvoiceResponse.deleteInvoiceResponse();
    res.status(response.status).json({status: response.type, message: response.message});
  }).catch(error => {
    const response = UserResponse.getUserError(error.errors[0].message)
    res.status(response.status).json({status: response.type, message: response.message});
  });
};

module.exports = {
  getInvoice,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
}