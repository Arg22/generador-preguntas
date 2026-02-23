    
    let questions = [];
    let correctCount = 0;
    let incorrectCount = 0;
    
    // ================= Navegación =================
    
    function show(id){
        document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
        document.getElementById(id).classList.add("active");
        document.querySelectorAll(".btn-nav").forEach(s=>s.classList.remove("active"));
        document.getElementsByClassName("btn-nav "+id)[0].classList.add("active");
    }
    
    // ================= QUIZ =================
    
    function newQuestion(){
        
        if(questions.length === 0){
            document.getElementById("statement").textContent = "No hay preguntas aún.";
            document.getElementById("answers").innerHTML = "";
            return;
        }
        
        const q = questions[Math.floor(Math.random() * questions.length)];
        
        document.getElementById("statement").textContent = q.enunciado;
        
        let answers = [
            q.correcta,
            ...q.incorrectas
        ];
        
        // mezclar respuestas
        answers.sort(() => Math.random() - 0.5);
        
        const container = document.getElementById("answers");
        container.innerHTML = "";
        
        answers.forEach(answer => {
            
            const btn = document.createElement("button");
            btn.textContent = answer;
            btn.className = "btn-answer";
            
            btn.onclick = () => {
                
                document.querySelectorAll(".btn-answer").forEach(b=>{
                    b.disabled = true;
                });
                
                if(answer === q.correcta){
                    
                    btn.classList.add("correct");
                    correctCount++;
                    document.getElementById("corrects").textContent = correctCount;
                    
                } else {
                    
                    btn.classList.add("wrong");
                    incorrectCount++;
                    document.getElementById("incorrects").textContent = incorrectCount;
                    
                    document.querySelectorAll(".btn-answer").forEach(b=>{
                        if(b.textContent === q.correcta){
                            b.classList.add("correct");
                        }
                    });
                }
            };
            
            container.appendChild(btn);
        });
    }

    document.getElementById("corrects").textContent = correctCount;
    document.getElementById("incorrects").textContent = incorrectCount;
    
    // ================= EDITOR =================
    
    function addRow(pregunta = null){
        
        const tbody = document.getElementById("table-data");
        const tr = document.createElement("tr");
        
        const datos = pregunta || {
            enunciado:"",
            correcta:"",
            incorrectas:["","",""]
        };
        
        tr.innerHTML = `
    <td><input placeholder="Enunciado" type="text" value="${datos.enunciado}"></td>
    <td><input placeholder="Respuesta correcta" type="text" value="${datos.correcta}"></td>
    <td><input placeholder="Respuesta incorrecta" type="text" value="${datos.incorrectas[0]}"></td>
    <td><input placeholder="Respuesta incorrecta" type="text" value="${datos.incorrectas[1]}"></td>
    <td><input placeholder="Respuesta incorrecta" type="text" value="${datos.incorrectas[2]}"></td>
    <td>
        <button class="btn-del" onclick="this.closest('tr').remove(); updateData()" title="Borrar">❌</button>
    </td>
`;
        
        tr.querySelectorAll("input").forEach(input=>{
            input.addEventListener("input", updateData);
        });
        
        tbody.appendChild(tr);
        updateData();
    }
    
    function updateData(){
        questions = [];
        document.querySelectorAll("#table-data tr").forEach(tr=>{
            const inputs = tr.querySelectorAll("input");
            questions.push({
                enunciado: inputs[0].value,
                correcta: inputs[1].value,
                incorrectas: [
                    inputs[2].value,
                    inputs[3].value,
                    inputs[4].value
                ]
            });
        });
    }
    
    function deleteAll(){
        showModal("¿Seguro que quieres borrar todo?", ()=>{
            document.getElementById("table-data").innerHTML="";
            questions=[];
        }, true);
    }
    
    // ================= JSON =================
    
    function downloadJSON(){
        updateData();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions,null,2));
        const a = document.createElement("a");
        a.href = dataStr;
        a.download = "questions.json";
        a.click();
    }
    
    function loadJSON(event){
        const file = event.target.files[0];
        if(!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e){
            questions = JSON.parse(e.target.result);
            document.getElementById("table-data").innerHTML="";
            questions.forEach(p=>addRow(p));
        };
        reader.readAsText(file);
    }
    
    // ================= MODAL =================
    
    function showModal(message, onConfirm = null, showCancel = false){
        const modal = document.getElementById("customModal");
        const msg = document.getElementById("modalMessage");
        const confirmBtn = document.getElementById("modalConfirm");
        const cancelBtn = document.getElementById("modalCancel");
        
        msg.textContent = message;
        modal.classList.add("show");
        
        cancelBtn.style.display = showCancel ? "inline-block" : "none";
        
        confirmBtn.onclick = ()=>{
            modal.classList.remove("show");
            if(onConfirm) onConfirm();
        };
        
        cancelBtn.onclick = ()=>{
            modal.classList.remove("show");
        };
    }
    