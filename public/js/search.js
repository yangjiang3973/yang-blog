import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import {
    configure,
    searchBox,
    hits,
    stats,
    pagination
} from 'instantsearch.js/es/widgets';

export const initSearch = () => {
    const searchClient = algoliasearch(
        '0TSTKQ89MM',
        '3856d53d41547560299236cc59b6023c' // search only API key, not admin API key
    );

    const search = instantsearch({
        indexName: 'dev_posts',
        searchClient,
        routing: true,
        searchFunction(helper) {
            const hitsContainer = document.querySelector('#hits');
            const paginationContainer = document.querySelector('#pagination');
            const statsContainer = document.querySelector('#search-stats');
            hitsContainer.style.display =
                helper.state.query === '' ? 'none' : '';
            paginationContainer.style.display =
                helper.state.query === '' ? 'none' : '';
            statsContainer.style.display =
                helper.state.query === '' ? 'none' : '';

            helper.search();
        }
    });

    search.addWidgets([
        configure({
            hitsPerPage: 5
        })
    ]);

    search.addWidgets([
        searchBox({
            container: '#search-box',
            placeholder: 'Search for posts',
            autofocus: true,
            searchAsYouType: false,
            showReset: true,
            showLoadingIndicator: true,
            cssClasses: {
                root: 'search__box',
                input: 'search__box--input',
                reset: 'search__box--reset',
                submit: 'search__box--submit',
                loadingIndicator: 'search__box--loading'
            }
        })
    ]);

    search.addWidgets([
        stats({
            container: '#search-stats',
            cssClasses: {
                root: 'search__stats'
            },
            templates: {
                text(data) {
                    let count = '';
                    if (data.hasManyResults) {
                        count += `${data.nbHits} results`;
                    } else if (data.hasOneResult) {
                        count += `1 result`;
                    } else {
                        count += `no result`;
                    }
                    return `${count} found in ${data.processingTimeMS}ms`;
                }
            }
        })
    ]);

    search.addWidgets([
        hits({
            container: '#hits',
            escapeHTML: false,
            cssClasses: {
                root: 'search__hits',
                list: 'search__hits--list',
                item: 'search__hits--item'
            },
            templates: {
                empty:
                    '<span class="search__hits--empty"> No results for <q>{{ query }}</q></span>',
                item(hit) {
                    return `
                    <article>
                      <a class="search__result--title" href="/posts/${
                          hit._id.$oid
                      }">${hit.title}</a>
                      <p class="search__result--snippet">
                      ${instantsearch.snippet({
                          attribute: 'text',
                          content: '80',
                          hit
                      })}</p>
                    </article>
                  `;
                }
            }
        })
    ]);

    search.addWidgets([
        pagination({
            container: '#pagination',
            showFirst: false,
            showPrevious: false,
            showNext: false,
            showLast: false,
            cssClasses: {
                root: 'search__pagination',
                list: 'search__pagination--list',
                item: 'search__pagination--item',
                selectedItem: 'search__pagination--item--selected'
            }
        })
    ]);

    search.start();
};
