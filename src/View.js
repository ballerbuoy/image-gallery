import { PreviewPane } from "./views/PreviewPane";
import { ListPane } from "./views/ListPane";

export class View {
  constructor(itemClickHandler, captionChangeHandler) {
    this.itemClickHandler = itemClickHandler;
    this.captionChangeHandler = captionChangeHandler;
    this.parentWrapper = this.getParentWrapper();
  }

  getParentWrapper() {
    return document.querySelector("[data-parent-wrapper]");
  }

  removePreviewPane() {
    if (this.previewPane) {
      this.parentWrapper.removeChild(this.previewPane.getPreviewPane());
    }
  }

  createListPane(data) {
    this.listPane = new ListPane(data, this.itemClickHandler);

    this.parentWrapper.insertBefore(
      this.listPane.getListPane(),
      this.previewPane
    );

    this.listPane.initTruncateCaption(2);
  }

  updateListPaneItemSelected(data) {
    this.listPane.updateListItemSelection(data);
  }

  updateListPaneOrder(target, draggedItemId) {
    this.listPane.updateItemOrder(target, draggedItemId);
  }

  createPreviewPane(data) {
    this.removePreviewPane();
    this.previewPane = new PreviewPane(
      data.data[data.selected],
      this.captionChangeHandler
    );

    this.parentWrapper.appendChild(this.previewPane.getPreviewPane());
  }

  render(data) {
    this.createListPane(data);
    this.createPreviewPane(data);
  }
}
