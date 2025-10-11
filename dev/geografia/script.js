document.addEventListener('DOMContentLoaded', function () {

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const newsContainer = document.getElementById('news-container');
    const modal = document.getElementById('news-modal');
    const closeModalBtn = document.querySelector('.modal-close');

    function formatDisplayDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    const sortedNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    function displayNews() {
        if (!newsContainer) return;
        newsContainer.innerHTML = '';

        const groupedNews = sortedNews.reduce((acc, newsItem) => {
            const date = new Date(newsItem.date + 'T00:00:00');
            const monthYear = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(newsItem);
            return acc;
        }, {});

        for (const monthYear in groupedNews) {
            const monthSection = document.createElement('section');
            monthSection.className = 'month-section';

            const title = document.createElement('h3');
            const capitalizedTitle = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
            title.className = 'month-section-title';
            title.textContent = capitalizedTitle;
            monthSection.appendChild(title);

            const newsRow = document.createElement('div');
            newsRow.className = 'news-row';

            const newsItemsForMonth = groupedNews[monthYear];
            newsItemsForMonth.forEach(newsItem => {
                const originalIndex = sortedNews.findIndex(item => item === newsItem);
                const newsCardHTML = `
                    <article class="news-card">
                        <img src="${newsItem.image}" alt="${newsItem.headline}">
                        <div class="news-content">
                            <h3>${newsItem.headline}</h3>
                            <p>${formatDisplayDate(newsItem.date)}</p>
                            <a href="#" class="read-more-btn" data-index="${originalIndex}">Leia Mais</a>
                        </div>
                    </article>
                `;
                newsRow.innerHTML += newsCardHTML;
            });

            monthSection.appendChild(newsRow);
            newsContainer.appendChild(monthSection);
        }
    }

    const modalImage = document.getElementById('modal-image');
    const modalDate = document.getElementById('modal-date');
    const modalHeadline = document.getElementById('modal-headline');
    const modalFullContent = document.getElementById('modal-full-content');

    function openModal(index) {
        const newsItem = sortedNews[index];
        modalImage.src = newsItem.image;
        modalImage.alt = newsItem.headline;
        modalDate.textContent = formatDisplayDate(newsItem.date);
        modalHeadline.textContent = newsItem.headline;
        modalFullContent.innerHTML = newsItem.content;
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    newsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('read-more-btn')) {
            event.preventDefault();
            const index = event.target.getAttribute('data-index');
            openModal(index);
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    displayNews();
});