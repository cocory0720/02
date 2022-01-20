'use restrict'

//필요한 변수들
const canvas_chart = document.getElementById('chart');
const ctx_chart = canvas_chart.getContext('2d');

const canvas_radial = document.getElementById('radial');
const ctx_radial = canvas_radial.getContext('2d');

const resultData = localStorage.getItem('result'); //이전 페이지에서 얻은 결과들
const getValue = JSON.parse(resultData);

const color = ['yellow', 'orange', 'red', 'green', 'turquoise', 'purple', 'yellowgreen', 'bluegreen', 'indigo', 'blue', 'magenta', 'redorange'];
//              0           1       2       3       4               5       6               7           8           9       10         11      

//함수 loadResults(): JSON 데이터를 받아서 처리하는 함수
function loadResults() { 
    return fetch('full_ver.json')
    .then(response => response.json())
    .then(json => json.results);
}

//함수 addStyle(): 결과로 나온 색상으로 입히는 함수
function addStyle(result) {
    const color = document.querySelector('.color')
    const content = document.querySelector('.content');
    const i = document.querySelectorAll('.result i');
    const short = document.querySelector('.result .short');
    const support1 = document.querySelector('.support1');
    const support2 = document.querySelector('.support2');

    color.classList.add(`${result[0].color}`); //color
    content.classList.add(`border_${result[0].color}`); 
    i.forEach((element) => element.classList.add(`icon_${result[0].color}`));    
    short.classList.add(`border_${result[0].color}`);
    support1.classList.add(`${result[0].support1}`);
    support2.classList.add(`${result[0].support2}`);    
}

//함수 displayResult(): 결과를 출력해주는 함수
function displayResult(results, maxLoc){
    let result_color = color[maxLoc];
    let selection = results.filter(result => result.color === result_color);
    const target = $(".btn");
    target.before(createHTMLString(selection));
    addStyle(selection);
} 

//함수 createHTMLString(): 결과 데이터를 동적으로 붙이는 함수
function createHTMLString(result) { 
    const ability_length = result[0].ability.length;
    const keyword_length = result[0].keyword.length;
    const job_length = result[0].job.length;
    const famous_length = result[0].famous.length;
    const text_length = result[0].text.length;

    let ability_string = `<li><i class="fas fa-check"></i> 능력: `;
    let keyword_string = `<li><i class="fas fa-check"></i> 키워드: `;
    let job_string =`<li><i class="fas fa-check"></i> 직업: `;
    let famous_string = `<li><i class="fas fa-check"></i> 유명인: `;
    let text_string = `<li class="short">`;

    //1. 능력 부분
    let sub_ability_string = ``;
    for(let i=0;i<ability_length;i++){
        if(i!==ability_length-1){
            sub_ability_string += `${result[0].ability[i]}, `;
        } else {
            sub_ability_string += `${result[0].ability[i]}</li>`;
        }
    }
    ability_string += sub_ability_string;

    //2. 키워드 부분
    let sub_keyword_string = ``;
    for(let i=0;i<keyword_length;i++){
        if(i!==keyword_length-1){
            sub_keyword_string += `${result[0].keyword[i]}, `;
        } else {
            sub_keyword_string += `${result[0].keyword[i]}</li>`;
        }
    }
    keyword_string += sub_keyword_string;
    
    //3. 직업 부분
    let sub_job_string = ``;
    for(let i=0;i<job_length;i++){
        if(i!==job_length-1){
            sub_job_string += `${result[0].job[i]}, `;
            // console.log(sub_job_string);
        } else {
            sub_job_string += `${result[0].job[i]}</li>`;
        }
    }
    job_string += sub_job_string;

    //4. 유명인 부분
    let sub_famous_string = ``;
    for(let i=0;i<famous_length;i++){
        if(i!==famous_length-1){
            sub_famous_string += `${result[0].famous[i]}, `;
        } else {
            sub_famous_string += `${result[0].famous[i]}</li>`;
        }
    }
    famous_string += sub_famous_string;

    //5. 텍스트 부분
    let sub_text_string = ``;
    for(let i=0;i<text_length;i++){
        if(i!==text_length-1){
            sub_text_string += `<i class="far fa-check-circle"></i> ${result[0].text[i]}<br>`;
        } else {
            sub_text_string += `<i class="far fa-check-circle"></i> ${result[0].text[i]}<br>
                                <div class="situ"> ${result[0].situation}</div>
                            </li>`;
        }
    }
    text_string += sub_text_string;

    let total_string = `
    <div class="result">
        <div class="color">${result[0].title}</div>
        <ul class="content">
            `+ability_string+keyword_string+job_string+famous_string+
            `<li><i class="fas fa-check"></i> 동물: ${result[0].animal}</li>`
            +text_string+
            `<li class="support">
                <div>Support Color</div>
                <div class="support1">${result[0].support1}</div>
                <div class="support2">${result[0].support2}</div>
            </li>
        </ul>
    </div>
    `;

    return total_string;
}

window.onload = function(){
    let resultArr = Object.values(getValue); //y축
    let matchArr = [...resultArr]; //number1, 2, 3 제거 -> 개수 세지 x
    matchArr.shift();
    matchArr.shift();
    matchArr.shift();

    let maxValue = Math.max(...matchArr);
    let maxLoc = matchArr.indexOf(maxValue);
    let ticks = []; //x축
    for(let i=1;i<=resultArr.length;i++){
        ticks.push(`${i}`);
    }

    //1. 막대 그래프 그리기
    let chart = new Chart(ctx_chart, {
        type: 'bar',
        data: {
            labels: ticks, //x축
            datasets: [{
                label: 'Bar Chart',
                data: resultArr,
                backgroundColor: '#FF6384',
                borderColor: 'rgb(255, 99, 132)',
            }]
        },
        options: {
            scales: { 
                yAxes: [{                   //y축 설정 
                    ticks: { 
                        stepSize: 1,        //y축 간격
                        suggestedMin: 0,    //y축 최소값
                        suggestedMax: 10,   //y축 최대값 
                    }
                }]
            },
            // legend: {
            //     display:true
            //     // position: 'left'
            // }
        }
    })

    //2. 방사형 그래프 그리기
    const labels = [1, 2, 3, 4, 5, 6, 7];
    const data = {
        labels: ticks,
        datasets: [{
            label: 'Radial Chart',
            data: resultArr,
            backgroundColor: 'transparent',
            borderColor: '#ea7387',
            borderWidth: 2,
        }]
    };

    let radial = new Chart(ctx_radial, {
        type: 'radar',
        data,
        options: {
            scale: {
                // gridLines: {
                //     color: "black",
                //     lineWidth: 3
                // },
                // angleLines: {
                //     display: false
                // },
                // ticks: {
                //     beginAtZero: true,
                //     min: 0,
                //     max: 100,
                //     stepSize: 20
                // },
                // pointLabels: {
                //     fontSize: 18,
                //     fontColor: "green"
                // }
            },
            legend: {
                // position: 'left'
            }
        }
    });

    loadResults()
    .then(results => {
        displayResult(results, maxLoc);
    })
    .catch(console.log);
}    