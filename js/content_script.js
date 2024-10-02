chrome.storage.local.get('scripts', items => {

  if(!items.scripts) return;

  for(let script of items.scripts){
    if(new RegExp(script.regex, script.regexFlags).test(window.location.href)){
      let scriptElement = document.createElement('script');
      scriptElement.src = 'data:text/javascript;base64,' + btoa(script.script);
      document.body.appendChild(scriptElement);
      break;
    }
  }

});