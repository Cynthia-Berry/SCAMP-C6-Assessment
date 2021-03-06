const Client = require("../models/client.model");
const errorCodes = require("../middlewares/enums/errorCodes.enum");
const ClientResponse = require('../middlewares/helpers/responses/client.response')
const UserResponse = require("../middlewares/helpers/responses/user.response");

const getClient = (req, res) => {
    Client.findAll()
        .then(clients => {
            const response = ClientResponse.getClientResponse();
            res.status(response.status).json({data: clients, status: response.type, message: response.message});
        })
        .catch((error) => {
            const response = error.errors[0]
            res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: response.message});
        });
};

const createClient = (req, res) => {
    Client.create(req.body).then((client) => {
        const response = ClientResponse.createClientResponse();
        res.status(response.status).json({data: client, status: response.type, message: response.message});
    }).catch(error => {
        const response = error.errors[0]
        res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: response.message});
    });
};

const getClientById = (req, res) => {
    Client.findByPk(req.params['id']).then(client => {
        const response = ClientResponse.getClientResponse();
        res.status(response.status).json({data: client, status: response.type, message: response.message});
    }).catch(error => {
        const response = error.errors[0]
        res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: response.message});
    })
};

const updateClient = async (req, res) => {
    try {
        const client = await Client.update(req.body, {
            where: {id: req.params['id']}
        });
        if (!client) {
            res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: ''});
        } else {
            const response = ClientResponse.getClientResponse();
            res.status(response.status).json({
                data: await Client.findByPk(req.params['id']),
                status: response.type,
                message: response.message
            });
        }
    } catch (e) {
        const response = e.errors[0]
        res.status(errorCodes.Error400.code).json({status: errorCodes.Error400.type, message: response.message});
    }
};

const deleteClient = (req, res) => {
    Client.findByPk(req.params['id']).then(async resp => {
        await Client.destroy({
            where: {id: resp.id}
        });
        const response = ClientResponse.deleteClientResponse();
        res.status(response.status).json({status: response.type, message: response.message});
    }).catch(error => {
   const response = UserResponse.getUserError(error.errors[0].message);
    res.status(response.status).json({status: response.type, message: response.message});    });
};

module.exports = {
    getClient,
    createClient,
    getClientById,
    updateClient,
    deleteClient,
}