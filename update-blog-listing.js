const fs = require('fs');
const path = require('path');

// 读取blog目录中的所有HTML文件
function getAllBlogArticles() {
    const blogDir = path.join(__dirname, 'blog');
    const files = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.html'))
        .filter(file => !file.includes('article-topics') && !file.includes('additional-article-topics'))
        .sort();
    
    const articles = [];
    
    files.forEach(file => {
        const filePath = path.join(blogDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 提取文章信息
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const descMatch = content.match(/<meta name="description" content="(.*?)">/);
        const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
        
        let title = titleMatch ? titleMatch[1].split('|')[0].trim() : file.replace('.html', '').replace(/-/g, ' ');
        let description = descMatch ? descMatch[1] : 'Professional golf bag guide and insights.';
        let heading = h1Match ? h1Match[1].replace(/<[^>]*>/g, '') : title;
        
        // 清理HTML标签
        title = title.replace(/<[^>]*>/g, '');
        description = description.replace(/<[^>]*>/g, '');
        heading = heading.replace(/<[^>]*>/g, '');
        
        // 生成分类
        let category = 'Guide';
        if (file.includes('brand') || file.includes('callaway') || file.includes('ping') || file.includes('titleist') || file.includes('taylormade')) {
            category = 'Brand Review';
        } else if (file.includes('material') || file.includes('sustainable') || file.includes('eco')) {
            category = 'Materials';
        } else if (file.includes('custom') || file.includes('personalization') || file.includes('design')) {
            category = 'Customization';
        } else if (file.includes('maintenance') || file.includes('care') || file.includes('cleaning')) {
            category = 'Maintenance';
        } else if (file.includes('tech') || file.includes('smart') || file.includes('innovation')) {
            category = 'Technology';
        } else if (file.includes('buying') || file.includes('guide') || file.includes('comparison')) {
            category = 'Buying Guide';
        } else if (file.includes('trend') || file.includes('industry') || file.includes('future')) {
            category = 'Industry News';
        }
        
        // 生成随机日期（2024年内）
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const dateStr = randomDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        // 随机选择图片
        const imageNum = Math.floor(Math.random() * 59) + 1;
        const imagePath = `images/golf bag (${imageNum}).jpg`;
        
        articles.push({
            file,
            title,
            description,
            heading,
            category,
            date: dateStr,
            image: imagePath,
            url: `blog/${file}`
        });
    });
    
    return articles;
}

// 生成文章HTML
function generateArticleHTML(article, index) {
    const isEven = index % 2 === 0;
    const fadeDelay = Math.floor(index / 6) * 100; // 每6篇文章增加延迟
    
    return `
                        <!-- Blog Post ${index + 1} -->
                        <div class="flex flex-col md:flex-row gap-6 fade-in" style="animation-delay: ${fadeDelay}ms;">
                            <div class="md:w-1/3">
                                <div class="rounded-xl overflow-hidden shadow-sm h-full card-hover">
                                    <img src="${article.image}" alt="${article.heading}" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300">
                                </div>
                            </div>
                            <div class="md:w-2/3">
                                <div class="flex items-center text-sm text-gray-dark mb-2">
                                    <span class="mr-4"><i class="fa fa-calendar-o mr-1"></i> ${article.date}</span>
                                    <span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"><i class="fa fa-folder-o mr-1"></i> ${article.category}</span>
                                </div>
                                <h3 class="text-xl font-bold mb-3 hover:text-primary transition-colors">${article.heading}</h3>
                                <p class="text-gray-dark mb-4 line-clamp-3">${article.description}</p>
                                <a href="${article.url}" class="inline-flex items-center text-primary font-semibold hover:underline group">
                                    Continue Reading <i class="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>
                        </div>`;
}

// 更新blog.html文件
function updateBlogHTML() {
    const articles = getAllBlogArticles();
    console.log(`Found ${articles.length} articles`);
    
    // 读取当前的blog.html
    const blogPath = path.join(__dirname, 'blog.html');
    let blogContent = fs.readFileSync(blogPath, 'utf8');
    
    // 生成文章列表HTML
    const articlesHTML = articles.map((article, index) => generateArticleHTML(article, index)).join('\n');
    
    // 更新特色文章（使用第一篇文章）
    const featuredArticle = articles[0];
    const featuredHTML = `
                    <!-- Featured Blog Post -->
                    <div class="mb-16 fade-in">
                        <div class="bg-white rounded-xl shadow-md overflow-hidden card-hover">
                            <img src="${featuredArticle.image}" alt="${featuredArticle.heading}" class="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500">
                            <div class="p-8">
                                <div class="flex items-center text-sm text-gray-dark mb-4">
                                    <span class="mr-4"><i class="fa fa-calendar-o mr-1"></i> ${featuredArticle.date}</span>
                                    <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"><i class="fa fa-folder-o mr-1"></i> ${featuredArticle.category}</span>
                                </div>
                                <h2 class="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors">${featuredArticle.heading}</h2>
                                <p class="text-gray-dark mb-6 text-lg leading-relaxed">${featuredArticle.description}</p>
                                <a href="${featuredArticle.url}" class="inline-flex items-center text-primary font-semibold hover:underline text-lg group">
                                    Read Full Article <i class="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>
                        </div>
                    </div>`;
    
    // 替换特色文章部分
    blogContent = blogContent.replace(
        /<!-- Featured Blog Post -->.*?<\/div>\s*<\/div>\s*<\/div>/s,
        featuredHTML
    );
    
    // 替换文章列表部分
    blogContent = blogContent.replace(
        /<!-- Blog Posts List -->.*?<\/div>\s*<!-- Pagination -->/s,
        `<!-- Blog Posts List -->
                    <div class="space-y-12">${articlesHTML}
                    </div>

                    <!-- Pagination -->`
    );
    
    // 更新分页信息
    const totalPages = Math.ceil(articles.length / 10);
    let paginationHTML = `
                    <!-- Pagination -->
                    <div class="mt-16 text-center fade-in">
                        <div class="mb-4 text-gray-dark">
                            <span class="font-medium">Showing ${articles.length} professional articles</span>
                        </div>
                        <nav class="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                            <a href="#" class="px-3 py-2 rounded-l-md border border-gray-medium bg-white text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">
                                <i class="fa fa-chevron-left"></i>
                            </a>
                            <a href="#" class="px-4 py-2 border-t border-b border-gray-medium bg-primary text-sm font-medium text-white">1</a>`;
    
    for (let i = 2; i <= Math.min(totalPages, 5); i++) {
        paginationHTML += `
                            <a href="#" class="px-4 py-2 border-t border-b border-gray-medium bg-white text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">${i}</a>`;
    }
    
    if (totalPages > 5) {
        paginationHTML += `
                            <span class="px-4 py-2 border-t border-b border-gray-medium bg-white text-sm font-medium text-gray-dark">...</span>
                            <a href="#" class="px-4 py-2 border-t border-b border-gray-medium bg-white text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">${totalPages}</a>`;
    }
    
    paginationHTML += `
                            <a href="#" class="px-3 py-2 rounded-r-md border border-gray-medium bg-white text-sm font-medium text-gray-dark hover:bg-gray-light transition-colors">
                                <i class="fa fa-chevron-right"></i>
                            </a>
                        </nav>
                    </div>`;
    
    blogContent = blogContent.replace(
        /<!-- Pagination -->.*?<\/div>\s*<\/div>/s,
        paginationHTML
    );
    
    // 写入更新后的内容
    fs.writeFileSync(blogPath, blogContent, 'utf8');
    console.log('Blog.html updated successfully!');
    console.log(`Featured ${articles.length} articles with improved layout and animations`);
}

// 运行更新
if (require.main === module) {
    updateBlogHTML();
}

module.exports = { updateBlogHTML, getAllBlogArticles };