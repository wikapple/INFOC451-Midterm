const chalk = require('chalk');
const debug = require('debug')('app:mediaController');
const MediaDataAccess = require('../data/mediaDataAccess');
const ItemDataAccess = require('../data/itemDataAccess');

class MediaController {


  constructor() {
    this._mediaDataAccess = new MediaDataAccess();
    this._itemDataAccess = new ItemDataAccess();
  }

  async addOrUpdateMedia(req, res) {
    const dbCallSuccessful =  (req.body?.id == 0) ?
      await this._mediaDataAccess.createMedia(req.body) :
      await this._mediaDataAccess.updateMedia(req.body); 

     if(dbCallSuccessful) {
       debug('dbcall success');
       return res.status(303).redirect('/media');
     } else {
       debug('dbCall failed');
       return res.status(500).send('db operation failed');
    }
  }

  async deleteMedia(req, res) {

    const dbCallSuccessful = await this._mediaDataAccess.deleteMediaById(req.params.mediaId);

    if (dbCallSuccessful) {
      return res.redirect('/media');
    } else {
      return res.sendStatus(500);
    }
  }

  async mediaListView(req, res) {
    let viewModel = {};

    viewModel.mediaTypes = await this._mediaDataAccess.getAllMediaTypes();

    res.render(`mediaViews/mediaList.ejs`, { viewModel });
  }

  async getMediaDetailsView(req, res) {

    const id = req.params.mediaId;
    let viewModel = {};

    const mediaDetails = await this._mediaDataAccess.getMediaById(id);

    viewModel.mediaDetails = mediaDetails;

    let rentalItemList = await this._itemDataAccess.getItemByBaseId(id);
  
    viewModel.rentalItemList = rentalItemList;

    res.render(`mediaViews/mediaDetail.ejs`, {viewModel});
  }

  async getCreateOrEditView(req, res) {
    const id = req.params.mediaId;
    let viewModel = {};
    if (id && id != 0) {
      viewModel.isNewMedia = false;
      viewModel.mediaToUpdate = await this._mediaDataAccess.getMediaById(id);
      if (!viewModel.mediaToUpdate) {
        res.redirect('/')
      }
    } else {
      viewModel.isNewMedia = true;
    }
    viewModel.categories = await this._mediaDataAccess.getAllCategories();
    viewModel.mediaTypes = await this._mediaDataAccess.getAllMediaTypes();

    res.render(`mediaViews/createOrEditMedia.ejs`, { viewModel });
  }
}

module.exports = MediaController;
