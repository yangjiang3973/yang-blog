export const tagsGenerator = () => {
    // from high freq to low freq
    const data = [
        // highest freq, largest size(6 different sizes)
        'HTML',
        'CSS',

        'NodeJS',

        'JavaScript',
        'MongoDB',
        'React',
        'Favorites',

        'Translations',

        'Reading Notes',

        'DevOps',
        'Github',
        'Design',
        'Nginx',

        'Vue'
    ];

    data.forEach((item, index) => {
        const tagElem = document.getElementById(`tag-${index + 1}`);
        const tagLink = document.createElement('a');
        tagLink.href = `/tags/${item}`;
        tagLink.className = 'tags__link';
        tagLink.innerText = item;
        tagElem.appendChild(tagLink);
    });
};
