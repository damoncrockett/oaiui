import openai
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

openai.organization = "org-OfwfdUVJ8Bi5vupyCQunS3NC"    
with open("/Users/damoncrockett/Dropbox/_unshared/work/unassigned-notes/keys-credentials/openai.txt") as f:
    l = f.readlines()
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

    completion = openai.Completion.create(engine="davinci", prompt=prompt, max_tokens=max_tokens)

    return completion.choices[0].text.replace("\n", " ")

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