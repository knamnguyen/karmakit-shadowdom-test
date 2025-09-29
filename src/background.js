// Background script for Reddit Comment Helper extension
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked on tab:', tab.url);
  
  // Check if we're on a Reddit page
  if (!tab.url.includes('reddit.com')) {
    console.log('Not a Reddit page, ignoring');
    return;
  }
  
  try {
    // Send message to content script to interact with comment box
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'addSampleComment'
    });
    
    console.log('Content script response:', response);
  } catch (error) {
    console.error('Failed to send message to content script:', error);
  }
});
