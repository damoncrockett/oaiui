import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import shutil
from dotenv import load_dotenv
import os
from collections import Counter

app = Flask(__name__)
CORS(app)

load_dotenv() 

openai.organization = os.getenv("OPENAI_ORGANIZATION")
openai.api_key = os.getenv("OPENAI_API_KEY") 

@app.route('/gpt', methods=['POST'])
def prompt_gpt():

    if request.method == 'POST':
        data = request.json
        compound_prompt = data['prompt']
        compound_prompt_list = compound_prompt.split("|")
        prompt = compound_prompt_list[0].strip()
        if len(compound_prompt_list) > 1:
            try:
                max_tokens = int(compound_prompt_list[1].strip())
            except:
                max_tokens = 120
        else:
            max_tokens = 120

    completion = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=max_tokens)

    return completion.choices[0].text

SAVEGPT = os.path.expanduser("~") + "/Desktop/GPT/"

@app.route('/gpt/save', methods=['POST'])
def save_gpt():

    if request.method == 'POST':
        data = request.json
        text = data['text']

    word_counts = [item[0].strip().lower() for item in Counter(text.split(" ")).most_common()]
    
    stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he',
                'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 
                'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 
                'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 
                'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
                'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 
                'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 
                'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 
                'will', 'just', 'don', 'should', 'now']

    fstring = '_'.join([item for item in word_counts if item not in stopwords][:16])
    savestr = get_savestr(SAVEGPT + fstring + ".txt")

    try:
        with open(savestr, 'wb') as f:
            f.write(text.encode('utf-8'))
        return jsonify({ "response":"success" })
    except:
        return jsonify({ "response":"error" })

@app.route('/dalle', methods=['POST'])
def prompt_dalle():

    if request.method == 'POST':
        data = request.json
        prompt = data['prompt']

    response = openai.Image.create(
        prompt=prompt,
        n=10,
        size="1024x1024"
        )

    return response

@app.route('/dalle/variants', methods=['POST'])
def get_variants():

    if request.method == 'POST':
        data = request.json
        image = data['image']

    response = openai.Image.create_variation(
        image=open(image, "rb"),
        n=10,
        size="1024x1024"
        )

    return response

SAVEDALLE = os.path.expanduser("~") + "/Desktop/DALLE/"

def add_underscore(savestr):
    n = len(os.path.basename(savestr)[:-4])
    l = savestr.split("_")
    if n >= 251:
        l[0] = l[0][:-1]
    l[-1] = "_.png"

    return "_".join(l)

def get_savestr(savestr):
    if os.path.exists(savestr):
        savestr = add_underscore(savestr)
        return get_savestr(savestr)
    else:
        return savestr

@app.route('/dalle/save', methods=['POST'])
def save_dalle():

    if request.method == 'POST':
        data = request.json
        url = data['url']
        prompt = data['prompt']
        buttonID = data['buttonID']
        savestr = get_savestr(SAVEDALLE + prompt[:250] + "_.png")

        try:
            r = requests.get(url,stream=True)
            if r.status_code == 200:
                with open(savestr, 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
            return jsonify({ "buttonID":buttonID, "savestr":savestr })
        except:
            return jsonify({ "buttonID":"error", "savestr":"error" })