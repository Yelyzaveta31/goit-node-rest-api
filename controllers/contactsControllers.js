
import HttpError from "../helpers/HttpError.js";
import { listContacts, getContactById, addContact, removeContact, updateContact, updateContactStatus } from "../services/contactsServices.js";


export const getAllContacts = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const filter = { owner };
        if (req.query.favorite) {
            filter.favorite=req.query.favorite === "true";
        }
        const { data }  = await listContacts({filter});

        res.json({
            status: 200,
            message: "Contacts get successfully",
            data,
          });
    }
    catch(error) {
    next(error);
}
};

export const getOneContact = async (req, res,next ) => {
    try {
        const {id: _id} = req.params;
        const {_id: owner} = req.user;
        const data = await getContactById({ _id, owner})
        
        if(!data) {
            throw HttpError(404, `Contact with id ${_id} not found`);
        }

          res.json({
      status: 200,
      message: `Contact get successfully`,
      data,
    });
    }
    catch(error){
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
      const { id: _id } = req.params;
      const { _id: owner } = req.user;
  
      const data = await removeContact({ _id, owner });
  
      if (!data) {
        throw HttpError(404,  `Contact with id ${_id} not found`);
      }
  
      res.json({
        status: 200,
        message: `Contact was deleted successfully`,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  export const createContact = async (req, res, next) => {
    try {
      const { _id: owner } = req.user;
      const { name, email, phone, favorite } = req.body;
  
      const data = await addContact(name, email, phone, favorite, owner);
  
      if (!data) {
        throw HttpError(400);
      }
  
      res.status(201).json({
        status: 201,
        message: `Contact was added successfully`,
        data,
      });
    }
    catch(error) {
        next(error);
    }
};

export const updatedContactController = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const { _id: owner } = req.user;
    
        const data = await updateContact({ _id, owner }, req.body);
    
        if (!data) {
          throw HttpError(404, `Contact with id ${_id} not found`);
        }
    
        res.json({
          status: 200,
          message: `Contact was updated successfully`,
          data,
        });
    } catch (error) {
      next(error);
    }
  };

  export const editFavoriteStatus = async (req, res, next) => {
    try {
      const { id: _id } = req.params;
      const { _id: owner } = req.user;
      const { favorite } = req.body;
  
      const data = await updateContactStatus({ _id, owner }, favorite);
      if (!data) {
        throw HttpError(404, `Contact with id ${_id} not found`);
      }
  
      res.json({
        status: 200,
        message: `Contact was updated successfully`,
        data,
      });
    } catch (error) {
      next(error);
    }
  };