function createPreviewPane(data, captionChangeHandler) {
  const previewPane = document.createElement("div");

  previewPane.classList.add("preview-pane");
  previewPane.dataset.id = "preview-pane";

  previewPane.appendChild(createPreviewImage(data.src));
  previewPane.appendChild(
    createPreviewCaption(data.caption, captionChangeHandler)
  );

  return previewPane;
}

function createPreviewImage(src) {
  const previewImage = document.createElement("img");
  previewImage.src = src;
  previewImage.classList.add("image-display");

  previewImage.dataset.contained = "preview-image";

  return previewImage;
}

function createPreviewCaption(caption, captionChangeHandler) {
  const previewCaption = document.createElement("div");
  previewCaption.innerText = caption;
  previewCaption.classList.add("caption-display");
  previewCaption.setAttribute("contenteditable", true);

  previewCaption.dataset.contained = "preview-caption";

  addEventHandler("input", previewCaption, captionChangeHandler);

  return previewCaption;
}

function addEventHandler(event, targetElement, eventHandler) {
  targetElement.addEventListener(event, eventHandler);
}

export { createPreviewPane };
