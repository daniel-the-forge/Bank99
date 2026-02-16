window.addEventListener("load", () => {
  const contentHeader = document.querySelector(".content-header.content");
  const topBar = document.querySelector(".top-bar .row");

  if (!contentHeader || !topBar) return;

  // Move the element
  topBar.appendChild(contentHeader);

  // Force a reflow so the browser registers the DOM change
  contentHeader.getBoundingClientRect();

  // Reveal after move
  contentHeader.classList.add("content-header--visible");
});


// Wait for DOM and try multiple times if needed
function initExpandableCheckbox() {
  const label = document.querySelector('.econ-checkbox-label');
  
  if (!label) {
    return false;
  }
  
  const paragraphs = label.querySelectorAll('p');
  
  if (paragraphs.length < 3) {
    return false;
  }
  
  const secondP = paragraphs[1];
  const thirdP = paragraphs[2];
  
  // Create "Mehr Informationen" link
  const moreLink = document.createElement('a');
  moreLink.href = '#';
  moreLink.textContent = 'Mehr Informationen';
  moreLink.className = 'mehr-info-link';
  moreLink.style.cssText = `
    display: block;
    margin-top: 8px;
    color: #0066cc;
    text-decoration: underline;
    cursor: pointer;
    font-size: var(--font-size-12);
  `;
  
  // Insert link after second paragraph
  secondP.parentNode.insertBefore(moreLink, thirdP);
  
  // Click handler
  moreLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add classes to expand
    secondP.classList.add('expanded');
    thirdP.classList.add('visible');
    
    // Hide the link
    moreLink.style.display = 'none';
  });
  
  return true;
}

// Try immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExpandableCheckbox);
} else {
  initExpandableCheckbox();
}

// Fallback: try again after a delay if it failed
setTimeout(() => {
  if (!document.querySelector('.mehr-info-link')) {
    initExpandableCheckbox();
  }
}, 500);

/* ========== File upload button - show/hide "Entfernen" button and filename ========== */
/* Uses event delegation to work with dynamically added file inputs */
function setupFileUploadButton(input) {
  const container = input.closest('.econ-form-control-file');
  const dropArea = input.closest('.econ-file-drop-area');
  const removeButton = container ? container.querySelector('.econ-file-remove-button') : null;
  
  // Create filename display element if it doesn't exist
  let filenameDisplay = container ? container.querySelector('.econ-file-name') : null;
  if (!filenameDisplay && container && dropArea) {
    filenameDisplay = document.createElement('span');
    filenameDisplay.className = 'econ-file-name';
    // Insert after the drop area
    if (dropArea.parentNode) {
      dropArea.parentNode.insertBefore(filenameDisplay, dropArea.nextSibling);
    }
  }
  
  // Handle file selection
  const handleFileChange = function() {
    if (container) {
      if (this.files && this.files.length > 0) {
        container.classList.add('has-file');
        if (filenameDisplay) {
          filenameDisplay.textContent = this.files[0].name;
        }
      } else {
        container.classList.remove('has-file');
        if (filenameDisplay) {
          filenameDisplay.textContent = '';
        }
      }
    }
  };
  
  // Remove old listener if exists and add new one
  input.removeEventListener('change', handleFileChange);
  input.addEventListener('change', handleFileChange);
  
  // Handle "Entfernen" button click
  if (removeButton) {
    const handleRemove = function(e) {
      e.preventDefault();
      e.stopPropagation();
      input.value = '';
      if (container) {
        container.classList.remove('has-file');
        if (filenameDisplay) {
          filenameDisplay.textContent = '';
        }
      }
    };
    removeButton.removeEventListener('click', handleRemove);
    removeButton.addEventListener('click', handleRemove);
  }
}

function initFileUploadButtons() {
  const fileInputs = document.querySelectorAll('.econ-file-drop-area input[type="file"]');
  fileInputs.forEach(setupFileUploadButton);
}

// Use event delegation for dynamically added file inputs
document.addEventListener('change', function(e) {
  if (e.target.matches('.econ-file-drop-area input[type="file"]')) {
    setupFileUploadButton(e.target);
  }
}, true);

// Use event delegation for dynamically added remove buttons
document.addEventListener('click', function(e) {
  if (e.target.matches('.econ-file-remove-button')) {
    const button = e.target;
    const container = button.closest('.econ-form-control-file');
    const input = container ? container.querySelector('.econ-file-drop-area input[type="file"]') : null;
    if (input) {
      e.preventDefault();
      e.stopPropagation();
      input.value = '';
      const filenameDisplay = container ? container.querySelector('.econ-file-name') : null;
      if (container) {
        container.classList.remove('has-file');
        if (filenameDisplay) {
          filenameDisplay.textContent = '';
        }
      }
    }
  }
}, true);

/* ========== "Weitere Dokumente/Nationalität/steuerliche Ansässigkeit hinzufügen" toggle button ========== */
/* Toggles between Ja and Nein on each click */
/* Uses event delegation to work with dynamically added elements */
/* Handles "weitereDokumente", "weitereNationalitaet", and "steueransaessigkeit2-ansaessig" */
function initWeitereToggle() {
  // Find all radio rows with matching patterns in the data-econ-property
  // Match all numbered instances of steueransaessigkeit (2-9)
  const selectors = [
    '.econ-fragment-radio-group:has([data-econ-property*="weitereDokumente"]) .econ-radio.row',
    '.econ-fragment-radio-group:has([data-econ-property*="weitereNationalitaet"]) .econ-radio.row'
  ];
  
  // Add selectors for steueransaessigkeit2 through steueransaessigkeit9
  for (let i = 2; i <= 9; i++) {
    selectors.push(`.econ-fragment-radio-group:has([data-econ-property*="steueransaessigkeit${i}"]) .econ-radio.row`);
  }
  
  const radioRows = document.querySelectorAll(selectors.join(', '));
  
  radioRows.forEach(function(radioRow) {
    // Skip if already initialized
    if (radioRow.dataset.toggleInitialized) return;
    radioRow.dataset.toggleInitialized = 'true';
    
    const group = radioRow.closest('.econ-fragment-radio-group');
    const jaRadio = group ? group.querySelector('.econ-radio-value-true input[type="radio"]') : null;
    const neinRadio = group ? group.querySelector('.econ-radio-value-false input[type="radio"]') : null;
    
    if (!jaRadio || !neinRadio) return;
    
    radioRow.addEventListener('click', function(e) {
      // Check if click is on the row itself (not a child element that might have its own handler)
      if (e.target === radioRow || radioRow.contains(e.target)) {
        const wasJaChecked = jaRadio.checked;
        
        if (wasJaChecked) {
          // Currently Ja, switch to Nein
          neinRadio.checked = true;
          jaRadio.checked = false;
          // Trigger change events
          neinRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        } else {
          // Currently Nein (or nothing), switch to Ja
          jaRadio.checked = true;
          neinRadio.checked = false;
          // Trigger change events
          jaRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
      }
    });
  });
}

/* ========== "Dokumente später nachreichen" checkbox toggle ========== */
/* Converts radio group into a single checkbox that toggles between Ja/Nein */
function initDokumenteSpaeterCheckbox() {
  const radioGroups = document.querySelectorAll(
    '.econ-fragment-radio-group:has([data-econ-property="bank99-antrag-antragssteller1-legitimation-bestaetigungUploadDokumente"])'
  );
  
  radioGroups.forEach(function(group) {
    // Skip if already initialized
    if (group.dataset.checkboxInitialized) return;
    group.dataset.checkboxInitialized = 'true';
    
    const radioRow = group.querySelector('.econ-radio.row');
    const jaRadio = group.querySelector('.econ-radio-value-true input[type="radio"]');
    const neinRadio = group.querySelector('.econ-radio-value-false input[type="radio"]');
    
    if (!radioRow || !jaRadio || !neinRadio) return;
    
    radioRow.addEventListener('click', function(e) {
      // Toggle: if Ja is checked, switch to Nein; otherwise switch to Ja
      if (jaRadio.checked) {
        neinRadio.checked = true;
        jaRadio.checked = false;
        neinRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      } else {
        jaRadio.checked = true;
        neinRadio.checked = false;
        jaRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      }
    });
  });
}

// Use event delegation for dynamically added radio rows
document.addEventListener('click', function(e) {
  // Build selector for all patterns
  const delegationSelectors = [
    '.econ-fragment-radio-group:has([data-econ-property*="weitereDokumente"]) .econ-radio.row',
    '.econ-fragment-radio-group:has([data-econ-property*="weitereNationalitaet"]) .econ-radio.row'
  ];
  
  // Add selectors for steueransaessigkeit2 through steueransaessigkeit9
  for (let i = 2; i <= 9; i++) {
    delegationSelectors.push(`.econ-fragment-radio-group:has([data-econ-property*="steueransaessigkeit${i}"]) .econ-radio.row`);
  }
  
  const radioRow = e.target.closest(delegationSelectors.join(', '));
  
  if (radioRow && !radioRow.dataset.toggleInitialized) {
    // Initialize if not already done
    initWeitereToggle();
    // Manually trigger the toggle
    const group = radioRow.closest('.econ-fragment-radio-group');
    const jaRadio = group ? group.querySelector('.econ-radio-value-true input[type="radio"]') : null;
    const neinRadio = group ? group.querySelector('.econ-radio-value-false input[type="radio"]') : null;
    
    if (jaRadio && neinRadio) {
      const wasJaChecked = jaRadio.checked;
      if (wasJaChecked) {
        neinRadio.checked = true;
        jaRadio.checked = false;
        neinRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      } else {
        jaRadio.checked = true;
        neinRadio.checked = false;
        jaRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      }
    }
  }
}, true);

// Event delegation for "Dokumente später nachreichen" checkbox
document.addEventListener('click', function(e) {
  const checkboxRow = e.target.closest(
    '.econ-fragment-radio-group:has([data-econ-property="bank99-antrag-antragssteller1-legitimation-bestaetigungUploadDokumente"]) .econ-radio.row'
  );
  
  if (checkboxRow) {
    const group = checkboxRow.closest('.econ-fragment-radio-group');
    if (group && !group.dataset.checkboxInitialized) {
      initDokumenteSpaeterCheckbox();
      // Manually trigger the toggle
      const jaRadio = group.querySelector('.econ-radio-value-true input[type="radio"]');
      const neinRadio = group.querySelector('.econ-radio-value-false input[type="radio"]');
      
      if (jaRadio && neinRadio) {
        if (jaRadio.checked) {
          neinRadio.checked = true;
          jaRadio.checked = false;
          neinRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        } else {
          jaRadio.checked = true;
          neinRadio.checked = false;
          jaRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
      }
    } else if (group && group.dataset.checkboxInitialized) {
      // Already initialized, just toggle
      const jaRadio = group.querySelector('.econ-radio-value-true input[type="radio"]');
      const neinRadio = group.querySelector('.econ-radio-value-false input[type="radio"]');
      
      if (jaRadio && neinRadio) {
        if (jaRadio.checked) {
          neinRadio.checked = true;
          jaRadio.checked = false;
          neinRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        } else {
          jaRadio.checked = true;
          neinRadio.checked = false;
          jaRadio.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
      }
    }
  }
}, true);

// Initialize all components
function initAllComponents() {
  initFileUploadButtons();
  initWeitereToggle();
  initDokumenteSpaeterCheckbox();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllComponents);
} else {
  initAllComponents();
}

// Fallback: try again after a delay
setTimeout(initAllComponents, 500);
// Also try after a longer delay in case elements are loaded dynamically
setTimeout(initAllComponents, 1500);

// Watch for dynamically added file inputs using MutationObserver
const observer = new MutationObserver(function(mutations) {
  let shouldReinit = false;
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.nodeType === 1) { // Element node
        // Check if new file inputs were added
        if (node.matches && node.matches('.econ-file-drop-area input[type="file"]')) {
          shouldReinit = true;
        }
        // Check if new file inputs were added inside this node
        if (node.querySelectorAll) {
          const fileInputs = node.querySelectorAll('.econ-file-drop-area input[type="file"]');
          if (fileInputs.length > 0) {
            shouldReinit = true;
          }
        }
        // Check if new radio groups were added
        const radioGroupSelectors = [
          '.econ-fragment-radio-group:has([data-econ-property*="weitereDokumente"])',
          '.econ-fragment-radio-group:has([data-econ-property*="weitereNationalitaet"])',
          '.econ-fragment-radio-group:has([data-econ-property="bank99-antrag-antragssteller1-legitimation-bestaetigungUploadDokumente"])'
        ];
        
        // Add selectors for steueransaessigkeit2 through steueransaessigkeit9
        for (let i = 2; i <= 9; i++) {
          radioGroupSelectors.push(`.econ-fragment-radio-group:has([data-econ-property*="steueransaessigkeit${i}"])`);
        }
        
        if (node.matches) {
          const matches = radioGroupSelectors.some(selector => {
            try {
              return node.matches(selector);
            } catch (e) {
              return false;
            }
          });
          if (matches) {
            shouldReinit = true;
          }
        }
        
        if (node.querySelectorAll) {
          const radioGroups = node.querySelectorAll(radioGroupSelectors.join(', '));
          if (radioGroups.length > 0) {
            shouldReinit = true;
          }
        }
      }
    });
  });
  
  if (shouldReinit) {
    initAllComponents();
  }
});

// Start observing
if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  document.addEventListener('DOMContentLoaded', function() {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}