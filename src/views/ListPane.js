const SELECTED = "selected-item";
const DRAGGED = "dragged";

export class ListPane {
  constructor(listData, itemClickHandler) {
    this.itemClickHandler = itemClickHandler;
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);

    this.listPane = document.createElement("div");
    this.listPane.classList.add("list-pane");
    this.listPane.dataset.id = "list-pane";

    this.listItems = this.createListItems(listData.data, listData.selected);
    this.appendItemsAsChildren(this.listPane, ...this.listItems);

    // Add event handlers for the events on listPane
    this.addEventHandler("click", this.listPane, this.itemClickHandler);
    this.addEventHandler("dragstart", this.listPane, this.dragStartHandler);
    this.addEventHandler("dragend", this.listPane, this.dragEndHandler);
    this.addEventHandler("dragover", this.listPane, this.dragOverHandler);
    this.addEventHandler("dragenter", this.listPane, this.dragEnterHandler);
    this.addEventHandler("dragleave", this.listPane, this.dragLeaveHandler);
    this.addEventHandler("drop", this.listPane, this.dropHandler);
  }

  getListPane() {
    return this.listPane;
  }

  dragStartHandler(event) {
    this.dragged = event.target.dataset.id;
    this.addDraggedItem(this.dragged);
  }

  dragEndHandler(event) {
    this.removeDraggedItem();
  }

  dropHandler(event) {
    this.updateItemOrder(event.target, this.dragged);
  }

  dragOverHandler(event) {
    //to allow the drop event to happen
    event.preventDefault();
  }

  dragEnterHandler(event) {
    if (event.target.dataset.contained === "item") {
      event.target.style.border = "3px dotted #666";
    }
  }

  dragLeaveHandler(event) {
    if (event.target.dataset.contained === "item") {
      event.target.style.border = "";
    }
  }

  createListItems(listData, selected) {
    return Object.keys(listData).reduce((acc, curItem) => {
      acc.push(this.createItem(listData[curItem], selected));
      return acc;
    }, []);
  }

  createItem(itemData, selected) {
    const itemWrapper = document.createElement("div");
    //add some CSS classes
    itemWrapper.classList.add("item");
    if (itemData.id === selected) {
      itemWrapper.classList.add(SELECTED);
    }
    itemWrapper.setAttribute("draggable", true);
    itemWrapper.setAttribute("tabindex", "0");

    itemWrapper.dataset.id = itemData.id;
    itemWrapper.dataset.contained = "item";
    itemWrapper.dataset.display = itemData.id === selected ? true : false;

    this.appendItemsAsChildren(itemWrapper, this.createThumbnail(itemData.src));
    this.appendItemsAsChildren(
      itemWrapper,
      this.createCaption(itemData.caption)
    );

    return itemWrapper;
  }

  createThumbnail(src) {
    const imageItem = document.createElement("img");
    imageItem.src = src;
    imageItem.dataset.contained = "image";

    imageItem.classList.add("item-image");

    return imageItem;
  }

  createCaption(caption) {
    const captionItem = document.createElement("div");
    captionItem.classList.add("item-caption");
    captionItem.innerText = caption;

    captionItem.dataset.contained = "caption";

    return captionItem;
  }

  appendItemsAsChildren(parentElement, ...args) {
    const children = [...args];
    children.forEach((child) => parentElement.appendChild(child));
  }

  addEventHandler(event, targetElement, eventHandler) {
    targetElement.addEventListener(event, eventHandler);
  }

  truncateCaption(captionContainer, lines = 1) {
    const maxHeight =
      Number(
        window.getComputedStyle(captionContainer).lineHeight.slice(0, -2)
      ) * lines;
    const maxWidth = "100%";
    captionContainer.style.width =
      lines > 1 ? maxWidth : captionContainer.style.width;

    if (captionContainer.clientHeight <= maxHeight) return;

    console.log(maxHeight, captionContainer.clientHeight);

    const data = captionContainer.innerText;
    // debugger;
    function canBePlaced(len) {
      const leftHalf = data.substr(0, len);
      const rightHalf = data.substr(data.length - len);
      captionContainer.innerText = leftHalf + "..." + rightHalf;

      return captionContainer.clientHeight <= maxHeight;
    }

    let low = 0,
      high = data.length,
      mid,
      ans = undefined;

    while (low <= high) {
      mid = ~~(low + (high - low) / 2);

      if (canBePlaced(mid)) {
        ans = ~~mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const finString = ans
      ? data.substr(0, ans) + "..." + data.substr(data.length - ans)
      : "";
    captionContainer.innerText = finString;
  }

  initTruncateCaption(lines = 1) {
    this.listPane.childNodes.forEach((listItem) => {
      this.truncateCaption(
        listItem.querySelector("[data-contained='caption']"),
        lines
      );
    });
  }

  updateListItemSelection(data) {
    const prevSelectedItem = this.listPane.querySelector(
      `[data-display='true']`
    );

    prevSelectedItem.dataset.display = false;
    prevSelectedItem.classList.remove(SELECTED);

    const selectedItem = this.listPane.querySelector(
      `[data-id='${data.selected}']`
    );

    selectedItem.dataset.display = true;
    selectedItem.classList.add(SELECTED);
  }

  addDraggedItem(data) {
    const draggedItem = this.listPane.querySelector(`[data-id='${data}']`);

    draggedItem.classList.add(DRAGGED);
    draggedItem.dataset.dragged = true;
  }

  removeDraggedItem() {
    const draggedItem = this.listPane.querySelector(`[data-dragged='true']`);

    draggedItem.classList.remove(DRAGGED);
    draggedItem.removeAttribute("data-dragged");
  }

  updateItemOrder(target, draggedId) {
    target.style.border = "";
    const draggedElement = this.listPane.querySelector(
      `[data-id='${draggedId}']`
    );

    this.listPane.insertBefore(draggedElement, target);
  }
}
