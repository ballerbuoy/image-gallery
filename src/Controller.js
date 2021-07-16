import { Model } from "./Model";
import { View } from "./View";

export class Controller {
  constructor(imageList) {
    this.model = new Model(imageList);
    this.view = new View(
      this.listPaneClickHandler.bind(this),
      this.previewPaneCaptionChangeHandler.bind(this)
    );

    this.view.render(this.getData());
  }

  getData() {
    return this.model.getImageData();
  }

  isItemChildTriggered(target) {
    return (
      target.dataset.contained === "image" ||
      target.dataset.contained === "caption"
    );
  }

  listPaneClickHandler(event) {
    //do nothing if the list pane is clicked
    if (event.target.dataset.id === "list-pane") return;

    const selectedItem = this.isItemChildTriggered(event.target)
      ? event.target.parentElement
      : event.target;
    //update the selected item in model
    this.model.setSelectedItem(selectedItem.dataset.id);

    this.view.updateListPaneItemSelected(this.getData());
    this.view.createPreviewPane(this.getData());
  }

  previewPaneCaptionChangeHandler(event) {
    this.model.updateCaption(event.target.innerText);

    this.view.updateListPane(this.getData());
  }
}
