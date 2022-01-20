'use restrict'

const parent = $('.questions');
const last_index = parent.children().last().index();

let now_page, next_page, pre_page;

let question_index;
let question_name;

let data =
    {
        "number1": 0,
        "number2": 0,
        "number3": 0,
        "number4": 0,
        "number5": 0,
        "number6": 0,
        "number7": 0,
        "number8": 0,
        "number9": 0,
        "number10": 0,
        "number11": 0,
        "number12": 0,
        "number13": 0,
        "number14": 0,
        "number15": 0,
    };

//변수 업데이트
function updateVar() {
    now_page = $('.now'); //now class 요소
    next_page = now_page.next(); //그 다음 요소 - now class 요소가 될 것
    pre_page = now_page.prev(); //그 이전 요소
    question_index = now_page.index(); //부모를 기준으로 현재 페이지의 인덱스 번호
    question_name = `question${question_index+1}`; //현재 문항에서 선택된 값을 받기 위해
}

//알림창
function showAlert() {
    const question_type = $(`input[name=${question_name}]`).attr("type");

    switch(question_type){
        case 'radio':
            if(!$(`input:${question_type}[name=${question_name}]`).is(':checked')){
                swal("", "체크가 안 되었습니다!", "error");
                return false;
            }
            return true;
        case 'checkbox':
            if($(`input:${question_type}[name=${question_name}]:checked`).length !== 2){
                swal("", "2개를 골라주세요!", "error");
                return false;
            }
            return true;
    }
}

function addNowClass(target_page, now_page) {
    target_page.addClass('now'); 
    now_page.hide();
    now_page.removeClass('now');
    target_page.show();
}

function makeTypeList(type, question_count) {
    let returnList = [];
    switch(type){
        case 'radio':
            for(let i=0;i<7;i++){
                let questionNum = `question${i + 1}`;
                let string = `input[name=${questionNum}]`; 
                returnList.push(document.querySelectorAll(string));
            }
            break;
        case 'checkbox':
            for(let i=7;i<question_count;i++){
                let questionNum = `question${i + 1}`; 
                let string = `input[name=${questionNum}]`; 
                returnList.push(document.querySelectorAll(string));
            }
            break;
    }
    return returnList;
}

function extractValue(checkboxList, question_count, radio_length) {
    let valueList = [];

    for(let i=0;i<question_count;i++){
        let questionNum = `question${i + 1}`;
        if(i<radio_length){
            let string = `input[name=${questionNum}]:checked`; 
            valueList.push(document.querySelector(string).value);
        }else{
            for(let j=0;j<3;j++){
                if(checkboxList[i-7][j].checked){
                    valueList.push(checkboxList[i-7][j].value);
                }
            }
        }
    }
    return valueList;
}

function updateData() {
    const question_count = parent.children().length;

    //1. radio name별로 묶어 배열에 저장
    let radioList = makeTypeList('radio', question_count);
    let checkboxList = makeTypeList('checkbox', question_count);

    //2. radio name별로 check된 항목의 value 값 추출해 배열에 저장
    let valueList = extractValue(checkboxList, question_count, radioList.length);

    //3. data 업데이트
    valueList.forEach(key => {
        data[key]++;
    });

    //4. 저장
    localStorage.setItem('result', JSON.stringify(data));
}

///buttons
function clickNextBtn(){
    //1. 변수 업데이트
    updateVar();

    if(question_index === last_index){
        if(!showAlert()){
            return;
        }
        updateData();
        location.href = 'result.html';
    }

    //2. 제대로 체크가 안 된 경우, 경고창 띄우기
    if(!showAlert()){
        return;
    }
    
    //3. now class 부여
    addNowClass(next_page, now_page);
}

function clickPreBtn() {
    //1. 변수 업데이트
    updateVar();

    if(question_index === 0){ //첫번째 페이지인 경우, 시작화면으로 돌아가기
        location.href = 'index.html';
    }

    //2. now class 부여
    addNowClass(pre_page, now_page);
}