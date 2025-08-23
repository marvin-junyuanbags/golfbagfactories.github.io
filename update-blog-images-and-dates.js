const fs = require('fs');
const path = require('path');

// 配置参数
const blogDir = path.join(__dirname, 'blog');
const imagesDir = path.join(__dirname, 'images');
const today = new Date();

// 获取所有博客文章文件
function getBlogFiles() {
  return fs.readdirSync(blogDir)
    .filter(file => path.extname(file) === '.html')
    .map(file => path.join(blogDir, file));
}

// 获取所有图片文件
function getImageFiles() {
  return fs.readdirSync(imagesDir)
    .filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))
    .map(file => path.join(imagesDir, file));
}

// 更新文章的发布日期和图片引用
function updateBlogFile(filePath, imageFiles, index) {
  console.log(`Processing: ${filePath}`);

  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');

  // 更新发布日期（从今天开始往后倒推）
  const publishDate = new Date(today);
  publishDate.setDate(today.getDate() - index);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = publishDate.toLocaleDateString('en-US', options);

  // 替换发布日期
  content = content.replace(/<i class="fa fa-calendar-o mr-2"><\/i> [A-Za-z]+ \d+, \d+/g, `<i class="fa fa-calendar-o mr-2"></i> ${formattedDate}`);

  // 替换图片引用
  // 找出所有图片引用
  const imageMatches = content.match(/<img[^>]+src="([^"]+)"[^>]*>/g) || [];

  imageMatches.forEach((match, imgIndex) => {
    // 为每篇文章的每张图片分配不同的本地图片
    const imageIndex = (index * 10 + imgIndex) % imageFiles.length;
    const imagePath = path.basename(imageFiles[imageIndex]);
    const newImgSrc = `../images/${imagePath}`;

    // 替换图片路径
    content = content.replace(match, match.replace(/src="([^"]+)"/, `src="${newImgSrc}"`));
  });

  // 保存修改后的文件
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
}

// 主函数
function main() {
  try {
    const blogFiles = getBlogFiles();
    const imageFiles = getImageFiles();

    if (blogFiles.length === 0) {
      console.log('No blog files found!');
      return;
    }

    if (imageFiles.length === 0) {
      console.log('No image files found!');
      return;
    }

    console.log(`Found ${blogFiles.length} blog files and ${imageFiles.length} image files.`);

    // 按文件名排序，确保每次处理顺序一致
    blogFiles.sort();

    // 处理每个博客文件
    blogFiles.forEach((filePath, index) => {
      updateBlogFile(filePath, imageFiles, index);
    });

    console.log('All blog files have been updated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 执行主函数
main();