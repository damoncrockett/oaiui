import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import shutil
import os

app = Flask(__name__)
CORS(app)

with open("/Users/damoncrockett/Dropbox/_unshared/work/unassigned-notes/keys-credentials/openai.txt") as f:
    l = f.readlines()
openai.organization = l[0].strip()
openai.api_key = l[2].strip()

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
                max_tokens = 100
        else:
            max_tokens = 100

    completion = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=max_tokens)

    return completion.choices[0].text

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

SAVEDIR = os.path.expanduser("~") + "/Desktop/DALLE/"

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
        savestr = get_savestr(SAVEDIR + prompt[:250] + "_.png")

        try:
            r = requests.get(url,stream=True)
            if r.status_code == 200:
                with open(savestr, 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
            return jsonify({ "buttonID":buttonID, "savestr":savestr })
        except:
            return jsonify({ "buttonID":"error", "savestr":"error" })