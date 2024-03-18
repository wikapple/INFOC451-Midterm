const chalk = require('chalk');
const debug = require('debug')('app:mediaApiController');
const MediaDataAccess = require('../data/mediaDataAccess');

class MediaApiController {

  
  constructor() {
    this._mediaDataAccess = new MediaDataAccess();
  }

  async getCategoryList(req, res) {

    const categories = await this._mediaDataAccess.getAllCategories();
    res.status(200).json(categories);
  }

  async getMediaTypeList(req, res) {
    const mediaDataAccess = new MediaDataAccess();
    const mediaTypes = await mediaDataAccess.getAllMediaTypes();
    res.status(200).json(mediaTypes);
  }
  async getMedia(req, res) {

    const dbResult=  await this._mediaDataAccess.getMediaById(req.params.mediaId);
    
    res.status(200).json(dbResult);
  }

  async getMediaListByType(req, res) {
    const mediaType = req.params.typeId;
    const filterValue = req.query.filter;

    const mediaList = filterValue ? 
      await this._mediaDataAccess.getMediaListByTypeAndFilter(mediaType, filterValue) :
      await this._mediaDataAccess.getMediaListByType(mediaType);

    for(let media of mediaList) {
      media.total = Number(media.total);
      media.totalAvailable = Number(media.totalAvailable);
    }

    res.status(200).json(mediaList);
  }

  async addOrUpdateMedia(req, res) {
    const mediaDataAccess = new MediaDataAccess();
    const dbCallSuccessful =  (req.body?.id == 0) ?
      await mediaDataAccess.createMedia(req.body) :
      await mediaDataAccess.updateMedia(req.body); 
    
    if(dbCallSuccessful) {
      res.sendStatus(204);
    } else {
      res.sendStatus(500);
    }
  }

  async deleteMedia(req, res) {

    const dbCallSuccessful =  await this._mediaDataAccess.deleteMediaById(req.params.mediaId);
    
    if(dbCallSuccessful) {
      res.sendStatus(204);
    } else {
      res.sendStatus(500);
    }
  }
}

module.exports = MediaApiController;
