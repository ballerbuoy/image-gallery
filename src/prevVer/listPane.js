const SELECTED = "selected-item";
const DRAGGED = "dragged";

function createListPane(
  listData,
  clickHandler,
  dragStartHandler,
  dragEndHandler,
  dropHandler
) {
  const listPane = document.createElement("div");
  listPane.classList.add("list-pane");
  listPane.dataset.id = "list-pane";

  const listItems = createListItems(listData.data, listData.selected);
  appendItemsAsChildren(listPane, ...listItems);

  addEventHandler("click", listPane, clickHandler);
  addEventHandler("dragstart", listPane, dragStartHandler);
  addEventHandler("dragend", listPane, dragEndHandler);
  addEventHandler("dragover", listPane, dragOverHandler);
  addEventHandler("dragenter", listPane, dragEnterHandler);
  addEventHandler("dragleave", listPane, dragLeaveHandler);
  addEventHandler("drop", listPane, dropHandler);
  // listPane.addEventListener("dragstart", dragStartHandler, false);

  return listPane;
}

function dragOverHandler(event) {
  event.preventDefault();
}

function dragEnterHandler(event) {
  if (event.target.dataset.contained === "item") {
    event.target.style.border = "3px dotted #666";
  }
}

function dragLeaveHandler(event) {
  if (event.target.dataset.contained === "item") {
    event.target.style.border = "";
  }
}

function createListItems(listData, selected) {
  return Object.keys(listData).reduce((acc, curItem) => {
    acc.push(createItem(listData[curItem], selected));
    return acc;
  }, []);
}

function createItem(itemData, selected) {
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

  appendItemsAsChildren(itemWrapper, createThumbnail(itemData.src));
  appendItemsAsChildren(itemWrapper, createCaption(itemData.caption));

  return itemWrapper;
}

function createThumbnail(src) {
  const imageItem = document.createElement("img");
  imageItem.src = src;
  imageItem.dataset.contained = "image";

  return imageItem;
}

function createCaption(caption) {
  const captionItem = document.createElement("div");
  captionItem.classList.add("item-caption");
  captionItem.innerText = caption;

  captionItem.dataset.contained = "caption";

  return captionItem;
}

function appendItemsAsChildren(parentElement, ...args) {
  const children = [...args];
  children.forEach((child) => parentElement.appendChild(child));
}

function addEventHandler(event, targetElement, eventHandler) {
  targetElement.addEventListener(event, eventHandler);
}

function truncateCaption(captionContainer, lines = 1) {
  if (
    lines === 1 &&
    captionContainer.clientWidth >= captionContainer.scrollWidth
  )
    return;
  if (
    lines > 1 &&
    captionContainer.clientHeight >= captionContainer.scrollHeight
  )
    return;

  const data = captionContainer.innerText;

  function canBePlaced(len) {
    const leftHalf = data.substr(0, len);
    const rightHalf = data.substr(data.length - len);
    captionContainer.innerText = leftHalf + "..." + rightHalf;

    if (lines > 1)
      return (
        captionContainer.clientHeight >=
        lines * captionContainer.style.lineHeight
      );

    return captionContainer.clientWidth >= captionContainer.scrollWidth;
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

function initTruncateCaption(listPane, lines = 1) {
  listPane.childNodes.forEach((listItem) => {
    truncateCaption(
      listItem.querySelector("[data-contained='caption']"),
      lines
    );
  });
}

function updateListItemSelection(listPane, data) {
  const prevSelectedItem = listPane.querySelector(`[data-display='true']`);

  prevSelectedItem.dataset.display = false;
  prevSelectedItem.classList.remove(SELECTED);

  const selectedItem = listPane.querySelector(`[data-id='${data.selected}']`);

  selectedItem.dataset.display = true;
  selectedItem.classList.add(SELECTED);
}

function addDraggedItem(listPane, data) {
  const draggedItem = listPane.querySelector(`[data-id='${data}']`);

  draggedItem.classList.add(DRAGGED);
  draggedItem.dataset.dragged = true;
}

function removeDraggedItem(listPane) {
  const draggedItem = listPane.querySelector(`[data-dragged='true']`);

  draggedItem.classList.remove(DRAGGED);
  draggedItem.removeAttribute("data-dragged");
}

function updateItemOrder(listPane, target, draggedId) {
  target.style.border = "";
  const draggedElement = listPane.querySelector(`[data-id='${draggedId}']`);

  listPane.insertBefore(draggedElement, target);
}

export {
  createListPane,
  initTruncateCaption,
  updateListItemSelection,
  addDraggedItem,
  removeDraggedItem,
  updateItemOrder
};
