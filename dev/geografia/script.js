document.addEventListener('DOMContentLoaded', function () {

    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburgerIcon && mobileNav) {
        hamburgerIcon.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

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
            const newsItemsForMonth = groupedNews[monthYear];

            const monthSection = document.createElement('section');
            monthSection.className = 'month-section';

            const capitalizedTitle = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

            monthSection.innerHTML = `
                <h3 class="month-section-title">${capitalizedTitle}</h3>
                <div class="month-content">
                    <div class="month-carousel-wrapper">
                        <button class="carousel-btn prev-btn"><i class="fa-solid fa-chevron-left"></i></button>
                        <div class="news-row-container">
                             <div class="news-row" data-total-items="${newsItemsForMonth.length}">
                                ${newsItemsForMonth.map(newsItem => {
                const originalIndex = newsData.findIndex(item => item.headline === newsItem.headline && item.date === newsItem.date);
                return `
                                    <article class="news-card">
                                        <img src="${newsItem.image}" alt="${newsItem.headline}">
                                        <div class="news-content">
                                            <h3>${newsItem.headline}</h3>
                                            <p>${formatDisplayDate(newsItem.date)}</p>
                                            <a href="#" class="read-more-btn" data-index="${originalIndex}">Leia Mais</a>
                                        </div>
                                    </article>
                                    `;
            }).join('')}
                            </div>
                        </div>
                        <button class="carousel-btn next-btn"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            `;
            newsContainer.appendChild(monthSection);
        }

        initAccordions();
        initCarousels();
    }

    function initAccordions() {
        const monthTitles = document.querySelectorAll('.month-section-title');
        monthTitles.forEach(title => {
            title.addEventListener('click', () => {
                const monthSection = title.parentElement;

                document.querySelectorAll('.month-section').forEach(section => {
                    if (section !== monthSection && section.classList.contains('active')) {
                        section.classList.remove('active');
                    }
                });

                monthSection.classList.toggle('active');
            });
        });
    }

    function initCarousels() {
        document.querySelectorAll('.month-carousel-wrapper').forEach(wrapper => {
            const prevBtn = wrapper.querySelector('.prev-btn');
            const nextBtn = wrapper.querySelector('.next-btn');
            const newsRow = wrapper.querySelector('.news-row');
            const totalItems = parseInt(newsRow.dataset.totalItems, 10);

            let currentIndex = 0;
            let itemsPerPage = 4;

            const updateItemsPerPage = () => {
                if (window.innerWidth <= 768) itemsPerPage = 1;
                else if (window.innerWidth <= 1024) itemsPerPage = 2;
                else if (window.innerWidth <= 1400) itemsPerPage = 3;
                else itemsPerPage = 4;
            };

            const updateCarousel = () => {
                const cardWidth = newsRow.querySelector('.news-card').offsetWidth;
                const gap = 20;
                const offset = currentIndex * (cardWidth + gap);
                newsRow.style.transform = `translateX(-${offset}px)`;

                prevBtn.classList.toggle('hidden', currentIndex === 0);
                nextBtn.classList.toggle('hidden', currentIndex >= totalItems - itemsPerPage);
            };

            nextBtn.addEventListener('click', () => {
                if (currentIndex < totalItems - itemsPerPage) {
                    currentIndex++;
                    updateCarousel();
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            window.addEventListener('resize', () => {
                updateItemsPerPage();
                if (currentIndex >= totalItems - itemsPerPage) {
                    currentIndex = Math.max(0, totalItems - itemsPerPage);
                }
                updateCarousel();
            });

            updateItemsPerPage();
            updateCarousel();
        });
    }

    const modalImage = document.getElementById('modal-image');
    const modalDate = document.getElementById('modal-date');
    const modalHeadline = document.getElementById('modal-headline');
    const modalFullContent = document.getElementById('modal-full-content');

    function openModal(index) {
        const newsItem = newsData[index];
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