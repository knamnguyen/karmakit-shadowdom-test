// Content script for Reddit Comment Helper extension
import { deepQuerySelector, asyncDeepQuerySelector } from 'shadow-dom-selector';

console.log('Reddit Comment Helper content script loaded');

// Message listener for background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'addSampleComment') {
    addSampleCommentToReddit()
      .then(result => {
        console.log('Add comment result:', result);
        sendResponse({ success: true, result });
      })
      .catch(error => {
        console.error('Add comment error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Keep message channel open for async response
    return true;
  }
});

async function addSampleCommentToReddit() {
  try {
    console.log('Starting Reddit comment interaction...');
    
    // Step 1: Find the comment button using shadow-dom-selector
    console.log('Looking for comment button...');
    const commentButton = await asyncDeepQuerySelector('faceplate-tracker[noun="add_comment_button"]', {
      retries: 5,
      delay: 1000
    });
    
    if (!commentButton) {
      throw new Error('Comment button not found');
    }
    
    console.log('Found comment button:', commentButton);
    console.log('Comment button attributes:', {
      source: commentButton.getAttribute('source'),
      action: commentButton.getAttribute('action'),
      noun: commentButton.getAttribute('noun')
    });
    
    // Step 2: Click the comment button to activate comment box
    console.log('Clicking comment button...');
    
    // Use more robust clicking approach
    commentButton.focus();
    commentButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 50));
    commentButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    commentButton.click();
    
    // Wait for Reddit to render the comment box
    console.log('Waiting for comment box to appear...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Look for the comment text input area with reduced overhead
    console.log('Looking for comment text input...');
    
    let textInput = null;
    
    try {
    // With the comment input area now expanded, try to find the actual text input field
    console.log('Searching for the expanded text input field...');
    
    // Try finding the main text input with various selectors
    const inputSelectors = [
      '[placeholder*="conversation"]',  // The "Join the conversation" field
      '[contenteditable="true"]',       // Contenteditable divs
      'textarea',                       // Textarea elements
      '[role="textbox"]'                // Role-based textboxes
    ];
    
    textInput = null;
    for (const selector of inputSelectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        textInput = await asyncDeepQuerySelector(selector, {
          retries: 1,
          delay: 500
        });
        
        if (textInput) {
          console.log(`Found text input with selector: ${selector}`, textInput);
          // Test if this element is actually interactive
          if (textInput.offsetHeight > 50) { // Likely the main input area
            break;
          }
        }
      } catch (error) {
        console.log(`Selector ${selector} failed:`, error.message);
      }
    }
    } catch (error) {
      console.log('Text input search encountered error (not critical):', error.message);
      // Don't throw here, just continue with a manual approach
    }
    
    if (!textInput) {
      // If we can't find text input via shadow-dom-selector, try a simpler approach
      console.log('Shadow DOM search failed, trying manual DOM search...');
      
      // Use a timeout to prevent infinite search
      const timeoutPromise = new Promise(resolve => {
        setTimeout(() => resolve(null), 5000);
      });
      
      const searchPromise = new Promise(resolve => {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const textarea = node.querySelector ? node.querySelector('textarea') : null;
                if (textarea) {
                  observer.disconnect();
                  resolve(textarea);
                  return;
                }
              }
            }
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Also try direct search
        const directSearch = document.querySelector('textarea');
        if (directSearch) {
          observer.disconnect();
          resolve(directSearch);
          return;
        }
      });
      
      textInput = await Promise.race([searchPromise, timeoutPromise]);
      
      if (textInput) {
        console.log('Found text input via manual search:', textInput);
      } else {
        throw new Error('Comment text input not found after click');
      }
    }
    
    // Step 4: Focus and type the sample comment
    console.log('Focusing and typing sample comment...');
    console.log('Text input element type:', textInput.tagName);
    console.log('Text input contenteditable:', textInput.contentEditable);
    
    // Focus the input with multiple methods to ensure activation
    textInput.focus();
    textInput.click();
    
    // Dispatch comprehensive focus events
    textInput.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    textInput.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    textInput.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    textInput.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    // Wait for focus and UI updates
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Type the sample text
    const sampleText = 'This is a sample comment';
    
    // Clear any existing content first
    if (textInput.tagName === 'TEXTAREA' || textInput.tagName === 'INPUT') {
      console.log('Working with form input element');
      textInput.value = '';
      textInput.value = sampleText;
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
      textInput.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (textInput.contentEditable === 'true') {
      console.log('Working with contenteditable element');
      textInput.innerText = '';
      textInput.innerText = sampleText;
      
      // Set cursor to end of text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textInput);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      
      textInput.dispatchEvent(new InputEvent('input', { 
        bubbles: true, 
        data: sampleText,
        inputType: 'insertText'
      }));
    } else {
      console.log('Working with generic element');
      textInput.textContent = sampleText;
      textInput.dispatchEvent(new InputEvent('input', { 
        bubbles: true, 
        data: sampleText 
      }));
    }
    
    console.log('Sample comment typed successfully!');
    
    return {
      commentButton: commentButton.outerHTML.substring(0, 100) + '...',
      textInput: textInput.outerHTML.substring(0, 100) + '...',
      sampleText
    };
    
  } catch (error) {
    console.error('Error in addSampleCommentToReddit:', error);
    throw error;
  }
}

// Initialize the content script
console.log('Reddit Comment Helper content script ready');