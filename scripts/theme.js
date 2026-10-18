import {$} from './dom.js';

function setTheme(t){
    document.documentElement.dataset.theme=t;
    $('#theme-toggle').setAttribute('aria-pressed', String(t=='dark'));
    $('#theme-toggle').textContent = t === 'dark' ? 'Light theme' : 'Dark theme';
    try{
        localStorage.setItem('sft:theme', t);
    }
    catch{
        
    }}
    
    $('#theme-toggle').addEventListener('click',()=> setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

    let saved = null;
    try{
        saved =localStorage.getItem('sft:theme');
    }
    catch{
    
    }
    setTheme(saved === 'dark' ? 'dark' : 'light');
