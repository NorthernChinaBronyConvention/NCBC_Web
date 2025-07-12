document.addEventListener('DOMContentLoaded', function() {
    // 设置日期
    const startDate = new Date('2025-07-01');
    const endDate = new Date('2025-08-9');
    const currentDate = new Date(); // 使用当前日期

    // 计算总天数和已过去天数
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysCompleted = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));

    // 已完成天数在有效范围内
    const validDaysCompleted = Math.max(0, Math.min(daysCompleted, totalDays));

    // 进度百分比
    const progressPercentage = Math.round((validDaysCompleted / totalDays) * 100);

    // 更新UI
    const progressDisplay = document.getElementById('progress-display');
    const progressPercentageElement = document.getElementById('progress-percentage');
    const daysCompletedElement = document.getElementById('days-completed');
    const totalDaysElement = document.getElementById('total-days');
    //const refreshBtn = document.getElementById('refresh-btn');//刷新按钮 禁用了

    // 这里生成进度条
    function generateProgressBar() {
        let progressHtml = '';
        const circleCount = 30; // 进度条圆圈总数

        // 每格代表的天数
        const daysPerCircle = totalDays / circleCount;
        const filledCircles = Math.round(validDaysCompleted / daysPerCircle);

        for (let i = 0; i < circleCount; i++) {
            const circle = document.createElement('span');
            circle.className = `${i < filledCircles ? 'filled-circle' : 'empty-circle'}`;
            circle.textContent = i < filledCircles ? '●' : '○'; //这里是进度条符号
            circle.style.animationDelay = `${i * 30}ms`;
            circle.classList.add('progress-animation');
            progressDisplay.appendChild(circle);
        }

        progressPercentageElement.textContent = `${progressPercentage}%`;
        daysCompletedElement.textContent = validDaysCompleted;
        totalDaysElement.textContent = totalDays;
    }

    // 初始生成进度条
    generateProgressBar();

    // 刷新按钮（还是不用刷新按钮了）
    //refreshBtn.addEventListener('click', function() {
        //this.classList.add('animate-pulse');

        // 重置进度条并重新生成
        //progressDisplay.innerHTML = '';
        //setTimeout(() => {
            //generateProgressBar();
            //this.classList.remove('animate-pulse');
        //}, 300);
    //});
});