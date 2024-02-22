document.addEventListener('DOMContentLoaded', function () {
  const commentsButton = document.getElementById('commentsButton');
  const overlay = document.getElementById('overlay');
  const commentModal = document.getElementById('commentModal');
  const addSnippetButton = document.getElementById('addSnippetButton');
  const commentTextArea = document.getElementById('commentTextArea');
  const saveCommentButton = document.getElementById('saveCommentButton');
  const snipContainer = document.getElementById('snipContainer');

  let isSelectingSnippet = false;
  let selectionOverlay;
  let startX, startY, endX, endY;

  // Event listener for commentsButton
  commentsButton.addEventListener('click', function () {
    $('#commentModal').modal('show');
  });

  // Event listener for addSnippetButton
  addSnippetButton.addEventListener('click', function () {
    $('#commentModal').modal('hide');
    startSelectingSnippet();
  });

  // Event listener for saveCommentButton
  saveCommentButton.addEventListener('click', function () {
    // Save the comment
    const comment = commentTextArea.value;
    console.log('Comment:', comment);
    // Reset the comment textarea
    commentTextArea.value = '';
    $('#commentModal').modal('hide');
  });

  // Event listener for modal close
  $('#commentModal').on('hidden.bs.modal', function () {
    resetSnippet();
  });

  // Function to start selecting snippet area
  function startSelectingSnippet() {
    isSelectingSnippet = true;
    overlay.style.display = 'block';
    overlay.style.cursor = 'crosshair';
    // Event listeners for mouse events
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    // Event listener for ESC key
    document.addEventListener('keydown', onKeyDown);
  }

  // Mouse down event handler
  function onMouseDown(event) {
    if (!isSelectingSnippet) return;
    startX = event.clientX;
    startY = event.clientY;
  }

  // Mouse move event handler
  function onMouseMove(event) {
    if (!isSelectingSnippet) return;
    if (!startX || !startY) return;

    const { clientX, clientY } = event;
    const width = Math.abs(clientX - startX);
    const height = Math.abs(clientY - startY);
    const left = Math.min(clientX, startX);
    const top = Math.min(clientY, startY);

    if (!selectionOverlay) {
      // Create selection overlay
      selectionOverlay = document.createElement('div');
      selectionOverlay.classList.add('selection-overlay');
      document.body.appendChild(selectionOverlay);
    }

    selectionOverlay.style.left = `${left}px`;
    selectionOverlay.style.top = `${top}px`;
    selectionOverlay.style.width = `${width}px`;
    selectionOverlay.style.height = `${height}px`;
  }

  // Mouse up event handler
  function onMouseUp(event) {
    if (!isSelectingSnippet) return;
    endX = event.clientX;
    endY = event.clientY;
    isSelectingSnippet = false;

    // Remove event listeners
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('keydown', onKeyDown);

    // Hide overlay
    overlay.style.display = 'none';

    // Capture the snippet
    captureSnippet();
  }

  // Key down event handler
  function onKeyDown(event) {
    if (event.key === 'Escape') {
      isSelectingSnippet = false;
      // Remove event listeners
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keydown', onKeyDown);
      // Hide overlay
      overlay.style.display = 'none';
      // Show the modal
      $('#commentModal').modal('show');
    }
  }

  // Function to capture the snippet
  function captureSnippet() {
    html2canvas(document.body, {
      x: selectionOverlay.offsetLeft,
      y: selectionOverlay.offsetTop,
      width: selectionOverlay.offsetWidth,
      height: selectionOverlay.offsetHeight
    }).then(canvas => {
      // Resize the captured image to fit inside the modal
      const img = document.createElement('img');
      img.src = canvas.toDataURL();
      img.style.width = '100%';
      img.style.height = 'auto';
      // Clear previous snippet if any
      snipContainer.innerHTML = '';
      // Append the captured image to the snipContainer
      snipContainer.appendChild(img);
      // Show the modal
      $('#commentModal').modal('show');
    }).catch(error => {
      console.error('Error capturing screen snip:', error);
    });
  }

  // Function to reset the selected snippet
  function resetSnippet() {
    startX = startY = endX = endY = null;
    if (selectionOverlay) {
      selectionOverlay.remove();
      selectionOverlay = null;
    }
  }
});
