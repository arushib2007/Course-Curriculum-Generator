from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin

# import pdfkit

# path_wkhtmltopdf = 'C:\\Program Files\\wkhtmltopdf'
# config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

from langchain.agents import initialize_agent
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import AgentType
from langchain_community.chat_models import ChatOpenAI

from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

import os
from dotenv import load_dotenv

load_dotenv()

# Sensitive Information
API_KEY = os.getenv('OPENAI_API_KEY')

llm=ChatOpenAI(model="gpt-4-turbo-preview", temperature=0, frequency_penalty=0, presence_penalty=0, 
               streaming=True, callbacks=[StreamingStdOutCallbackHandler()])

from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(memory_key = "chat_history")

tools = tools = load_tools([], llm=llm)

agent_chain = initialize_agent(llm=llm, tools = [], agent = AgentType.CONVERSATIONAL_REACT_DESCRIPTION, verbose = False, handle_parsing_errors = True, memory = memory)

def prompt_template(course_topic, num_weeks, num_chapters, num_tests, final_format):
    prompt = f"""You are a professor at a college, expert at desgning and creating a course in the field of {course_topic}. This course will take {num_weeks} weeks to complete.
    {num_chapters} chapters should be covered in the course duration. Students will have {num_tests} tests and the finals 
    format will be a {final_format}. You are an expert at writing contents for each specific week and each chapter.
    """
    
    return prompt

def quiz_prompt_template(results):
    prompt = f"Please pull a simple bullet list of only the chapter titles from {results}. Each item in the list should only contain the chapter number and title. No other information should be included."

    return prompt

@app.route("/")
def home():
    return "Welcome to My App"

@app.route("/about")
def about():
    return 'About My Application'

@app.route("/handle_submit", methods = ['POST'])
@cross_origin()
def handle_submit():
    data = request.get_json()

    subject = data['subject']
    weeks = data['weeks']
    chapters = data['chapters']
    tests = data['tests']
    final_exam_or_project = data['finalExamOrProject']

    prompt = prompt_template(
        course_topic = subject, 
        num_weeks = weeks, 
        num_chapters = chapters, 
        num_tests = tests, 
        final_format = final_exam_or_project)  

    agent_response = agent_chain.run(prompt)
    return render_template('results.html', agent_response=agent_response)

    # prompt_template(subject, difficulty, weeks, chapters, midterms, final_exam_or_project)

# # To Do: Handle Conversion of JSON Response to PDF
# @app.route("/handle_pdf", methods = ['POST'])
# @cross_origin()
# def handle_pdf():
#     html = '<h1>Testing</h1>'
#     return pdfkit.from_string(html, 'response.pdf', configuration=config)

@app.route('/generate_quiz', methods= ['POST'])
@cross_origin()
def generate_quiz():
    data = request.get_json()
    chapters = data['chapters']

    prompt = quiz_prompt_template(chapters)

    agent_response = agent_chain.run(prompt)

    return render_template('results.html', agent_response=agent_response)


if __name__ == '__main__':
    app.run(debug=True)