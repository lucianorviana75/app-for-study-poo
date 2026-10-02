from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/validar-poo', methods=['POST'])
def validar_poo():
    data = request.json
    classe = data.get('className', 'MinhaClasse')
    atributos = data.get('attributes', [])
    metodos = data.get('methods', [])

    tem_init = any(m.get('type') == 'init' for m in metodos)
    
    code = f"class {classe}:\n"
    if tem_init or atributos:
        params = ", ".join([a['name'] for a in atributos if a.get('name')])
        code += f"    def __init__(self{', ' + params if params else ''}):\n"
        if not atributos:
            code += "        pass\n"
        else:
            for a in atributos:
                code += f"        self.{a['name']} = {a['name']}\n"
    
    # Detalhes dos atributos para o print
    attr_str = " ".join([f"{a['name']}={{self.{a['name']}}}" for a in atributos if a.get('name')])

    for m in metodos:
        if m.get('type') != 'init':
            nome_clean = m['name'].replace('()', '')
            params = f", {m['params']}" if m.get('params') else ""
            if attr_str:
                code += f"\n    def {nome_clean}(self{params}):\n        print(f\"Executando {nome_clean} com {attr_str}...\")\n"
            else:
                code += f"\n    def {nome_clean}(self{params}):\n        print(f\"Executando {nome_clean}...\")\n"
            
    if not atributos and not metodos:
        code += "    pass"

    status = "ESTÁVEL" if (tem_init or atributos) and len(atributos) > 0 else "INCOMPLETO"

    return jsonify({
        "status": status,
        "code": code,
        "attr_count": len(atributos),
        "func_count": len(metodos)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)