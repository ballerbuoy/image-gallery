export class PreviewPane {
  constructor(data, captionChangeHandler) {
    this.previewPane = document.createElement("div");

    this.previewPane.classList.add("preview-pane");
    this.previewPane.dataset.id = "preview-pane";

    this.previewPane.appendChild(this.createPreviewImage(data.src));
    this.previewPane.appendChild(
      this.createPreviewCaption(data.caption, captionChangeHandler)
    );
  }

  getPreviewPane() {
    return this.previewPane;
  }

  createPreviewImage(src) {
    const previewImage = document.createElement("img");
    previewImage.src = src;
    previewImage.classList.add("image-display");

    previewImage.dataset.contained = "preview-image";

    return previewImage;
  }

  createPreviewCaption(caption, captionChangeHandler) {
    const previewCaption = document.createElement("div");
    previewCaption.innerText = caption;
    previewCaption.classList.add("caption-display");
    previewCaption.setAttribute("contenteditable", true);

    previewCaption.dataset.contained = "preview-caption";

    this.addEventHandler("input", previewCaption, captionChangeHandler);

    return previewCaption;
  }

  addEventHandler(event, targetElement, eventHandler) {
    targetElement.addEventListener(event, eventHandler);
  }
}
