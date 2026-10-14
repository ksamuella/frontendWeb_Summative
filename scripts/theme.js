import {$} from '.dom.js';

function setTheme(t){
    document.documentElement.dataset.theme=t;
    $('#theme-toogle').setAttribute('aria-pressed', String(t=='dark'));
    $('#theme-toogle').textContent = t === 'dark' ? 'Light theme' : 'Dark theme';
    try{
        localStorage.setItem('sft:theme', t);
    }
    catch{
        
    }
    $('#theme-toogle').addEventListener('click',()=> setTheme(document.documentElement.dataset.theme === 'dark' ? 'Light' : 'dark'));


    let saved = null;
    try{
        saved =localStorage.getItem('sft:theme');
    }
    catch{
    
    }
    setTheme(saved === 'dark' ? 'dark' : 'light');
}