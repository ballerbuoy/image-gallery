export class Model {
  constructor(imageList) {
    this.imageData = {};
    this.addData(imageList);
    this.selected = 0;
  }

  addData(list) {
    this.imageData = { ...this.imageData, ...this.getObjectFromList(list) };
  }

  updateCaption(newCaption) {
    this.imageData[this.selected].caption = newCaption;
  }

  getObjectFromList(list) {
    return list.reduce((acc, curItem) => {
      acc[curItem.id] = curItem;
      return acc;
    }, {});
  }

  setSelectedItem(id) {
    this.selected = id;
  }

  getImageData() {
    return {
      data: this.makeDeepCopy(this.imageData),
      selected: this.selected
    };
  }

  makeDeepCopy(dataObj) {
    const newObj = Array.isArray(dataObj) ? [] : {};
    newObj.__proto__ = dataObj.__proto__;

    Object.keys(dataObj).forEach((property) => {
      if (typeof property === "object") {
        newObj[property] = this.makeDeepCopy(dataObj[property]);
      } else {
        newObj[property] = dataObj[property];
      }
    });

    return newObj;
  }
}
