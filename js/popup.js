(() => {

  let editIndex = -1;

  const toggleTab = tab => {
    let tabElements = document.querySelectorAll('[tab]');
    for(let tabElement of tabElements){
      if(tabElement.getAttribute('tab') !== tab){
        tabElement.style.display = 'none';
        continue;
      }
      tabElement.style.display = 'block';
      switch(tab){
        case 'edit':
          setEditTab();
          break;
        case 'backup':
          setBackupTab();
          break;
        default:
          editIndex = -1;
          refreshList();
      }
    }
  };

  const deleteScript = index => {
    chrome.storage.local.get('scripts', items => {
      if(!items.scripts) return;
      let scripts = items.scripts.filter((current, idx, arr) => index !== idx);
      chrome.storage.local.set({scripts}, () => {
        refreshList();
        toggleTab('list');
      })
    });
  }

  const setEditTab = () => {
    let editTab = document.querySelector('[tab="edit"]');
    let deleteButton = editTab.querySelector('[name="delete"]');
    deleteButton.style.display = 'none';
    if(editIndex > -1){

      deleteButton.style.display = 'inline-block';
      deleteButton.onclick = e => deleteScript(editIndex);

      chrome.storage.local.get('scripts', items => {

        if(!items.scripts) return;

        let {
          regex,
          regexFlags,
          script
        } = items.scripts[editIndex];

        editTab.querySelector('[name="regex"]').value = regex;
        editTab.querySelector('[name="regex_flags"]').value = regexFlags;
        editTab.querySelector('[name="script"]').value = script;

      });
    }
  };

  const setBackupTab = () => {
    let backupTab = document.querySelector('[tab="backup"]');
    chrome.storage.local.get('scripts', items => {
      if(!items.scripts) return;
      backupTab.querySelector('a').setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(items.scripts)));
    });
    backupTab.querySelector('[name="upload"]').onclick = e => {
      let file = backupTab.querySelector('input').files[0];
      let reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = e => chrome.storage.local.get('scripts', items => {
        let scripts = items.scripts || [];
        scripts = [...scripts, ...JSON.parse(e.target.result)];
        chrome.storage.local.set({scripts}, () => {
          refreshList();
          toggleTab('list');
        });
      });
      reader.onerror = e => alert('failed!');
    }
  };

  const refreshList = () => {

    let editTabInputs = document.querySelector('[tab="edit"]').querySelectorAll('input, textarea');
    for(let input of editTabInputs)
      input.value = '';

    chrome.storage.local.get('scripts', items => {
      let scripts = items.scripts || [];
      let listTab = document.querySelector('[tab="list"]');
      let listElement = listTab.querySelector('ul');
      let listElementContent = '';

      for(let i in scripts)
        listElementContent += `<li>${scripts[i].regex}</li>`;

      listElement.innerHTML = listElementContent;

      let listContentElements = listElement.getElementsByTagName('li');
      for(let i in listContentElements){
        listContentElements[i].onclick = e => {
          editIndex = parseInt(i);
          toggleTab('edit');
        };
      }

    });

  };

  let tabTogglers = document.querySelectorAll('[toggle="tab"]');
  for(let tabToggler of tabTogglers)
    tabToggler.onclick = e => toggleTab(tabToggler.getAttribute('target'));

  document.querySelector('[tab="edit"]').querySelector('[name="save"]').onclick = e => {
    chrome.storage.local.get('scripts', items => {
      let editTab = document.querySelector('[tab="edit"]');
      let scripts = items.scripts || [];
      let script = {
        regex : editTab.querySelector('[name="regex"]').value,
        regexFlags : editTab.querySelector('[name="regex_flags"]').value,
        script : editTab.querySelector('[name="script"]').value
      };
      if(editIndex > -1) scripts[editIndex] = script;
      else scripts.push(script);
      chrome.storage.local.set({scripts}, () => {
        refreshList();
        toggleTab('list');
      });
    });
  };

  refreshList();

})();