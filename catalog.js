window.onload = function () {
    /*
     * ----------------------------------------
     * 创建新的目录、内容和底部提示 布局结构
     * ----------------------------------------
    */

    function createContainer() {
        //获取已有正文内容
        let oldContent = document.body.innerHTML;
        //清空已有内容
        document.body.innerHTML = '';
        //创建左侧目录、右侧内容结构元素
        //1.创建目录、内容结构父级空元素
        let leftBlock = document.createElement('div');
        let rigthBlock = document.createElement('div');
        //2.设置目录、内容父级元素id属性
        leftBlock.id = 'left-container';
        rigthBlock.id = 'right-container';
        //3.设置目录父级元素的内容结构
        leftBlock.innerHTML = '\n<div class="top-container">\n' +
            '        <i class="catalog-button iconfont icon-catalogOpen"></i>\n' +
            '        <div class="search-container">\n' +
            '            <input type="text" class="search" placeholder="输入关键字搜索">\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div id="list-container">\n' +
            '        <div class="list-wrapper">\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div class="bottom-container">\n' +
            '        <div class="mode-container">\n' +
            '            <div class="mode">\n' +
            '                <i class="iconfont icon-sun"></i>\n' +
            '            </div>\n' +
            '            <div class="index">\n' +
            '                <i class="iconfont icon-indexA"></i>\n' +
            '            </div>\n' +
            '            <div class="structure">\n' +
            '                <i class="iconfont icon-process"></i>\n' +
            '                <ul class="structure-child">\n' +
            '                    <li>\n' +
            '                        <input type="radio" id="styleA" name="value" checked>\n' +
            '                        <label for="styleA">样式 A</label>\n' +
            '                    </li>\n' +
            '                    <li>\n' +
            '                        <input type="radio" id="styleB" name="value">\n' +
            '                        <label for="styleB">样式 B</label>\n' +
            '                    </li>\n' +
            '                    <li>\n' +
            '                        <input type="radio" id="styleC" name="value">\n' +
            '                        <label for="styleC">样式 C</label>\n' +
            '                    </li>\n' +
            '                </ul>\n' +
            '            </div>\n' +
            '            <div class="color">\n' +
            '                <i class="iconfont icon-color"></i>\n' +
            '                <div class="color-child">\n' +
            '                    <span>自定义颜色</span>\n' +
            '                    <input type="color">\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '   <div id="switch-button">\n' +
            '   <div>\n<i class="iconfont icon-arrLeft"></i>\n</div>\n' +
            '   </div>\n';
        //4.设置内容父级元素的内容结构
        rigthBlock.innerHTML = '\n<div id="content">\n' +
            oldContent +
            '\n</div>\n' + '</div>\n';

        //5.追加结构元素到页面
        document.body.appendChild(leftBlock);
        document.body.appendChild(rigthBlock);

        //6.底部提示
        let msg = '<p style="font-size:' +
            ' 14px;color:#999999;margin-top:60px;padding-top: 10px;border-top:1px' +
            ' solid #ccc;">' +
            ' 提示：目录生成插件默认将 h1 标签作为文档的题目，不作为标题，当检测到有多个 h1 标签时，会将除了第一个 h1' +
            ' 标签（标题）外的所有 h1 标签自动转换为 h2 标签。该插件仅在使用 MarkDown 软件将 .md 文件转为 .html' +
            ' 文件时生效，且不影响 MarkDown 源文件。' +
            '<br/>如有问题请联系： cayang512@163.com&emsp;<a href="https://github.com/CayangPro/MarkdownPad2_UI" target="_blank">目录生成插件 GitHub 地址</p>';
        //5.追加结构元素到页面
        noteTips('div', msg, 'content');
    }

    //内容区父容器
    var content = document.getElementById('content');

    /*
    * ----------------------------------------
    * 将多余的 H1 转为 H2，并依次将其他h标签降一级
    * ----------------------------------------
    */
    function changeTag() {
        let h1Tag = document.querySelectorAll('h1');
        if (h1Tag.length > 1) {
            for (let j = 1; j < 6; j++) {
                let tagOld = 'h' + j;
                let tagNew = 'h' + eval(j + 1);
                let tagSet = document.querySelectorAll(tagOld);
                for (let i = 1; i < tagSet.length; i++) {
                    let newNode = document.createElement(tagNew);
                    // 替换内容
                    newNode.innerHTML = tagSet[i].innerHTML;
                    content.replaceChild(newNode, tagSet[i]);
                }
            }
        }
    }

    /**
     * ----------------------------------------
     * 获取 H 标签后的数字
     * ----------------------------------------
     * @param tag obj 标签对象
     *
     */
    function getTagNumber(tag) {
        if ((typeof tag) != 'object') {
            return 'getTagNumber() 调用时参数类型错误，必须是一个h标签的对象集合！';
        }
        return Number(tag.nodeName.slice(1));
    }

    /**
     * ----------------------------------------
     * 设置递增的 level 编号
     * ----------------------------------------
     * @param tag obj 标签对象
     *
     */
    function setLevelNumber(tag) {
        if ((typeof tag) != 'object') {
            return 'setLevelNumber() 调用时参数类型错误，必须是一个h标签的对象集合！';
        }
        let str = tag.id;
        if (str.length <= 7) { //如果是 level-1 形式
            let newValue = parseInt(str.slice(-1)) + 1;
            return str.slice(0, -1) + newValue;
        }
        if (str.length > 7) { //如果是 level-1.1 level-1.1.1 ... 形式
            let lastIndex = str.lastIndexOf('.');
            let oldValue = str.slice(0, lastIndex);
            let newValue = parseInt(str.slice(lastIndex + 1)) + 1;
            return oldValue + '.' + newValue;
        }

    }

    /*
     * ----------------------------------------
     * 设置所有 h 标签带层级的 id
     * ----------------------------------------
     */
    function setTagLevel() {
        // 将多余的 H1 转为 H2
        changeTag();
        // 获取所有h2~h6标签，h1作为文档的题目，不作为目录标签
        let allTag = document.querySelectorAll('h2,h3,h4,h5,h6');
        console.log(allTag);
        //判断目录数量，确定第一、二个标题的层级
        if (allTag.length === 0) {
            let msg = '<p style="color:#cccccc;font-size:' +
                ' 14px;text-align: center;">啊...<br/>文档中未发现 h2~h6 标签<br/>无法生成目录</p>';
            noteTips('div', msg, 'list-container');
            return false;
        } else if (allTag.length === 1) {
            allTag[0].id = 'level-' + '1'; //第一个标签肯定为一级标题
        } else if (allTag.length > 1) {
            allTag[0].id = 'level-' + '1';
            let result = getTagNumber(allTag[1]) - getTagNumber(allTag[0]);
            if (result <= 0) {  //第二个与第一个属于同级标题
                allTag[1].id = setLevelNumber(allTag[0]);
            } else {  // 第二个是第一个的子标题
                allTag[1].id = allTag[0].id + '.1';
            }
        } else {
            return false;
        }

        let tagLength = allTag.length;
        for (let i = 2; i < tagLength - 1; i++) {
            let currentTagNumber = getTagNumber(allTag[i]);
            let prevTagNumber = getTagNumber(allTag[i - 1]);
            if (currentTagNumber < prevTagNumber) {
                for (let j = i - 1; j >= 0; j--) {
                    //如果两个标签的数字值相差 等于 1 或 0，代表这两个标签是同级
                    let status = getTagNumber(allTag[j]) - currentTagNumber;
                    if (status === 1) {
                        if (j > 0) {
                            // 类似 h3 h4 h3 的特殊情况
                            if (getTagNumber(allTag[j - 1]) === currentTagNumber) {
                                allTag[i].id = setLevelNumber(allTag[j - 1]);
                                break;
                            }
                        } else {
                            allTag[i].id = setLevelNumber(allTag[j]);
                            break;
                        }
                    }
                    if (status === 0) {
                        allTag[i].id = setLevelNumber(allTag[j]);
                        break;
                    }
                }
            }

            if (currentTagNumber > prevTagNumber) {
                allTag[i].id = allTag[i - 1].id + '.1';
            }

            if (currentTagNumber === prevTagNumber) {
                allTag[i].id = setLevelNumber(allTag[i - 1]);
            }
        }

        //确定最后一个标题的层级
        let tagSet = document.querySelectorAll(allTag[tagLength - 1].nodeName);
        allTag[tagLength - 1].id = setLevelNumber(tagSet[tagSet.length - 2]);

    }

    /*
  * 目录结构
  *
  *  <ul>
         <li>
             <a href="">
                 <p>1</p>
                 <span>1 级标题</span>
             </a>
             <ul>
                 <li>
                     <a href="">
                         <p>1.1</p>
                         <span>2 级标题</span>
                     </a>
                     <ul>
                         <li>
                             <a href="">
                                 <p>1.1.1</p>
                                 <span>3 级标题</span>
                             </a>
                         </li>
                         <li>
                             <a href="">
                                 <p>1.1.1.1</p>
                                 <span>4 级标题</span>
                             </a>
                             <ul>
                                 <li>
                                     <a href="">
                                         <p>1.1.1.2</p>
                                         <span>5 级标题</span>
                                     </a>
                                 </li>
                             </ul>
                         </li>
                     </ul>
                 </li>
             </ul>
         </li>
     </ul>
  *
  */

    /**
     * ----------------------------------------
     * 判断目录等级，最大为 5 级即 h6 标签
     * 根据指 id 属性中 level- 中 "." 字符出现的次数判断
     * 0为一级，1为二级，依次类推
     * ----------------------------------------
     * @param str string 需要在哪个字符串中查找
     * @param char string 要查找的字符串
     * @return number 返回指定字符char出现的数字
     */

    function findStrFre(str, char) {
        if ((typeof str) !== 'string' || (typeof str) !== 'string') {
            return 'findStrFre() 调用时参数类型错误！';
        }
        let index = str.indexOf(char);
        let number = 0;
        while (index !== -1) {
            number++; // 每出现一次 次数加一
            // 从字符串出现的位置的下一位置开始继续查找
            index = str.indexOf(char, index + 1);
        }
        return number;
    }

    /**
     * ----------------------------------------
     * 寻找指定等级的目录的集合
     * ----------------------------------------
     *
     * @param level number 第几级目录，最大 5
     *
     */
    function levelTagArr(level) {
        if (level < 1 || level > 5 || (typeof level) !== 'number') {
            return 'levelTagArr() 调用时参数类型错误！';
        }
        // 所有目录集合
        let allTag = document.querySelectorAll('h2,h3,h4,h5,h6');
        let level1 = [];
        let level2 = [];
        let level3 = [];
        let level4 = [];
        let level5 = [];
        for (let i = 0; i < allTag.length; i++) {
            let number = findStrFre(allTag[i].id, '.');
            switch (number) {
                case 0:
                    level1.push(allTag[i]);
                    break;
                case 1:
                    level2.push(allTag[i]);
                    break;
                case 2:
                    level3.push(allTag[i]);
                    break;
                case 3:
                    level4.push(allTag[i]);
                    break;
                case 4:
                    level5.push(allTag[i]);
                    break;
                default:
                    i++;
            }
        }
        switch (level) {
            case 1:
                return level1;
            case 2:
                return level2;
            case 3:
                return level3;
            case 4:
                return level4;
            case 5:
                return level5;
            default:
                return;
        }
    }

    /**
     * ----------------------------------------
     * 根据父目录找到其下的第一级子目录集合
     * ----------------------------------------
     * @param tagObj obj 父目录标签对象
     *
     */
    function childTagArr(tagObj) {
        if ((typeof tagObj) !== 'object') {
            return 'childTagArr() 调用时参数类型错误，必须是一个 h 标签的对象集合';
        }
        let result = [];
        // 判断父级目录 tagObj 是第几级目录
        let level = findStrFre(tagObj.id, '.') + 1; // findStrFre() 0为一级
        if (level === 5) { // 第五级目录
            result.push(tagObj);
        } else {
            //找到该父级目录的下一级目录的所有同级目录
            let allChildTag = levelTagArr(level + 1);
            let faTagId = tagObj.id.slice(6); //父级目录id编号
            // 找到该目录下的子目录
            for (let i = 0; i < allChildTag.length; i++) {
                //子目录中去掉id值中最后一个 "." 后与父级相同就是该父级的子目录
                // 父目录: level-1.1 子目录：level-1.1.1  level-1.1.23
                let chTagId = allChildTag[i].id.slice(6,
                    allChildTag[i].id.lastIndexOf('.'));
                if (chTagId === faTagId) {
                    result.push(allChildTag[i]);
                }
            }
        }
        return result;
    }

    /*
     * ----------------------------------------
     * 创建目录
     * ----------------------------------------
     */
    function creatCatalogue() {
        // 设置所有 h 标签的等级 id
        setTagLevel();

        // 确定目录的最大层级
        let maxLevel = 1;
        for (let i = 5; i > 0; i--) {
            if (levelTagArr(i).length > 0) {
                maxLevel = i;
                break;
            }
        }
        // 目录父容器
        let catalogueBlock = document.querySelector('.list-wrapper');
        // 创建其余子目录
        let ulElement = document.createElement('ul');
        for (let j = 1; j <= maxLevel; j++) {
            let levelArr = levelTagArr(j); // 指定等级的目录集合
            if (j === 1) {
                for (let k = 0; k < levelArr.length; k++) {
                    let liElement = document.createElement('li');
                    liElement.innerHTML = '\n<a href="#' + levelArr[k].id + '" class=' + levelArr[k].id + '>\n' +
                        '<p>' + levelArr[k].id.slice(6) + '</p>\n' +
                        '<span>' + levelArr[k].innerText + '</span>' +
                        '</a>\n';
                    ulElement.appendChild(liElement);
                    // 追加目录到目录容器中
                    catalogueBlock.appendChild(ulElement);
                }
            }
            if (j > 1) {
                for (let n = 0; n < levelArr.length; n++) {
                    // 上一级目录
                    // 2.追加 ul 到该 上级目录的 li 中
                    let prevLevelArr = levelTagArr(j - 1);
                    for (let m = 0; m < prevLevelArr.length; m++) {
                        // 当前的 id 值 （去掉 level-和最后一个 "."之后所有值的中间值）
                        let currentId = levelArr[n].id.slice(6, levelArr[n].id.lastIndexOf('.'));
                        // 父目录的 id 值 （去掉 level-）
                        let prevId = prevLevelArr[m].id.slice(6);
                        // 找到所属的上一级目录
                        if (currentId === prevId) {
                            // 找到父目录 li 并添加 class
                            let className = prevLevelArr[m].id;
                            let prevElement = document.getElementsByClassName(className)[0].parentNode;
                            prevElement.setAttribute('class', 'parent-level');
                            let liElement = document.createElement('li');
                            liElement.innerHTML = '\n<a href="#' + levelArr[n].id + '" class=' + levelArr[n].id + '>\n' +
                                '<p>' + levelArr[n].id.slice(6) + '</p>\n' +
                                '<span>' + levelArr[n].innerText + '</span>' +
                                '</a>\n';
                            let currentUlElement = prevElement.querySelector('ul');
                            if (currentUlElement !== null) {
                                currentUlElement.appendChild(liElement);
                            } else {
                                // 创建父目录的 ul
                                currentUlElement = document.createElement('ul');
                                currentUlElement.appendChild(liElement);
                                prevElement.appendChild(currentUlElement);
                                // 创建 父目录样式
                                let parentStyle = document.createElement('i');
                                parentStyle.setAttribute('class', 'iconfont icon-redcude');
                                prevElement.insertBefore(parentStyle, prevElement.childNodes[0]);
                            }
                            break;
                        }
                    }
                }

            }
        }
    }

    /**
     * ----------------------------------------
     * 提示说明
     * ----------------------------------------
     * @param tag sting 提示消息的标签 div p
     * @param msg string 提示消息
     * @param id string 父容器，要追加到哪个父容器中的id
     */
    function noteTips(tag, msg, id) {
        if ((typeof tag) !== 'string' || (typeof msg) !== 'string' ||
            (typeof id) !== 'string') {
            return 'noteTips() 调用时参数类型错误！';
        }
        let exp = document.createElement(tag);
        exp.innerHTML = msg;
        //5.追加结构元素到页面
        document.getElementById(id).appendChild(exp);
    }

    //执行，注意执行顺序
    createContainer();
    creatCatalogue();

    /*
    * ----------------------------------------
    * 点击左侧隐藏图标
    * ----------------------------------------
     */

    let leftElement = document.querySelector('#left-container');
    let rightElement = document.querySelector('#right-container');
    let topElement = document.querySelector('.top-container');
    let listElement = document.querySelector('#list-container');
    let bottomElement = document.querySelector('.bottom-container');
    let contentmElement = document.querySelector('#container');

    let switchButton = document.querySelector('#switch-button');

    function switchCatalog() {

        switchButton.onclick = function () {
            let isActive = switchButton.querySelector('.active');
            let browsertWidth = document.documentElement.clientWidth;
            if (isActive) {
                if(browsertWidth > 750){
                    leftElement.style.width = '270px';
                }else{
                    leftElement.style.width = '60%';
                }
                leftElement.classList.remove('js-switch-button');
                this.children[0].children[0].setAttribute('class','iconfont icon-arrLeft');
                rightElement.style.padding = '15px 15px 0 285px';
                // rightElement.style.padding('full-padding');
            } else {
                leftElement.classList.add('js-switch-button');
                leftElement.style.width = '0';
                leftElement.style.padding = '0';
                leftElement.classList.add('js-switch-button');
                this.children[0].children[0].setAttribute('class','iconfont icon-arrRight active');
                rightElement.style.padding = '15px 15px 0';
            }
        }
    }

    switchCatalog();


    //border-color
    switchButton.onmouseover = function () {
        leftElement.style.borderColor = '#3cae7c';
    }
    switchButton.onmouseout = function () {
        leftElement.style.borderColor = '#ccc';
    }

    /*let catalogBOx = document.querySelector('#list-container');
    let allIcon = catalogBOx.querySelectorAll('.iconfont');
    document.querySelector('.catalog-button').onclick = function () {
        this.classList.remove('icon-mulu');
        this.classList.add('icon-mulu1');
        let allUl = catalogBOx.querySelectorAll('li ul');
        for (let i = 0; i < allUl.length; i++) {
            allUl[i].style.display = 'block';
            allUl[i].parentElement.children[0].setAttribute('class', 'iconfont icon-jian');
        }
        for (let j = 0; j< allIcon.length; j++) {
            allIcon[j].setAttribute('class', 'iconfont icon-jian');
        }
    };

    function indexClick() {
        for (let i = 0; i < allIcon.length; i++) {
            allIcon[i].onclick = function () {
                this.classList.remove('icon-jia');
                this.classList.add('icon-jian');
                this.parentElement.children[2].style.display = 'block';
            };
        }
    }

    indexClick();*/


};