import '@babel/polyfill';
import { login, loginByGithub, register, logout } from './login';
import { updateEmail, updateName, updatePassword } from './accountSetting';
import { commentSubmit } from './comment';
import { menuFloat } from './layoutController';
import { tagsGenerator } from './tags';

window.addEventListener('load', init, false);
window.onscroll = menuFloat;

function init() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                login();
            },
            false
        );
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                register();
            },
            false
        );
    }

    const logoutButton = document.getElementById('logout-user');
    if (logoutButton) {
        logoutButton.addEventListener(
            'click',
            e => {
                e.preventDefault();
                logout();
            },
            false
        );
    }

    const commentButton = document.getElementById('submit-comment');
    if (commentButton)
        commentButton.addEventListener('click', commentSubmit, false);

    const flyoutToggle = document.getElementById('flyout-toggle');
    if (flyoutToggle) {
        const flyoutBody = document.getElementById('flyout-body');
        document.body.addEventListener(
            'click',
            e => {
                // e.preventDefault();  // will prevent other element's click events
                flyoutBody.classList.remove('flyout__open');
            },
            false
        );
        flyoutToggle.addEventListener(
            'click',
            e => {
                e.stopPropagation();
                flyoutBody.classList.toggle('flyout__open');
            },
            false
        );
        flyoutBody.addEventListener(
            'click',
            e => {
                e.stopPropagation();
            },
            false
        );
    }

    const accountEmailBtn = document.getElementById('account-email-btn');
    if (accountEmailBtn)
        accountEmailBtn.addEventListener('mousedown', updateEmail, false);

    const accountNameBtn = document.getElementById('account-name-btn');
    if (accountNameBtn)
        accountNameBtn.addEventListener('mousedown', updateName, false);

    const editPasswordForm = document.getElementById('password-edit-form');
    if (editPasswordForm)
        editPasswordForm.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                updatePassword();
            },
            false
        );

    const tagsGrid = document.getElementById('tags-grid');
    if (tagsGrid) tagsGenerator();

    // search
    const searchClient = algoliasearch(
        '0TSTKQ89MM',
        '3856d53d41547560299236cc59b6023c' // search only API key, not admin API key
    );

    const search = instantsearch({
        indexName: 'dev_posts',
        searchClient,
        routing: true
    });

    search.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: 10
        })
    ]);

    search.addWidgets([
        instantsearch.widgets.searchBox({
            container: '#search-box',
            placeholder: 'Search for contacts'
        })
    ]);

    search.addWidgets([
        instantsearch.widgets.hits({
            container: '#hits',
            templates: {
                item: document.getElementById('hit-template').innerHTML,
                empty: `We didn't find any results for the search <em>"{{query}}"</em>`
            }
        })
    ]);

    search.start();
}
