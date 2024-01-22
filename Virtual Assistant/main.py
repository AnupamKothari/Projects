import pyttsx3
import speech_recognition as sr 
import datetime
import wikipedia 
import webbrowser
import os
import json
import requests
import openai
import config as con


engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
# print(voices[1].id)
engine.setProperty('voice', voices[0].id)

#setting up speaking function for virtual assistant
def speak(audio):
    engine.say(audio)
    engine.runAndWait() #blocks application untill engine finishes speaking


chatstr=""
msg=[]
#For advance conversation with the assistant
def chat(query):
    global chatstr
    openai.api_key =con.apikey
    try:
        global msg
        msg.append({'role':'user','content':query})
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=msg,)
        chatstr=response["choices"][0]['message']['content']
        print('\nAssistant:'+chatstr)
        speak(response["choices"][0]['message']['content'])
        msg.append({'role':'assistant','content':chatstr})
        return 
    
    except Exception as e:
        print(e)

def ai(message):
    openai.api_key =con.apikey
    text=f"{message}\n\n"
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
    {
      "role": "user",     #can either be user,assiatant
      "content": message
    }
  ],
  temperature=1,
  max_tokens=500,
)
    # print(response["choices"][0]["message"]["content"])
    text+=response["choices"][0]['message']['content']
    if not os.path.exists("AIFiles"):
        os.mkdir("AIFiles")
    
    with open(f"AIFiles/{''.join(message.split('ai')[1:])}.txt","w") as f:
        f.write(text)

#For Greeting
def wishMe():
    hour = int(datetime.datetime.now().hour)
    if hour>=0 and hour<12:
        speak("Good Morning!")

    elif hour>=12 and hour<17:
        speak("Good Afternoon!")   

    else:
        speak("Good Evening!")  

    speak("I am virtual assistant Sir. Please tell me how may I help you")       

def takeCommand():
    #It takes microphone input from the user and returns string output

    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 1
        audio = r.listen(source)

    try:
        print("Recognizing...")    
        query = r.recognize_google(audio, language='en-in')
        print(f"User said: {query}\n")

    except Exception as e:
        # print(e)    
        print("Say that again please...")  
        return "None"
    return query

def tellDay():
    day=datetime.datetime.today().weekday()+1
    week={1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday',6:'Saturday',7:'Sunday'}
    if day in week.keys():
        day_of_week=week[day]
        print(day_of_week)
        speak('The day is ' + day_of_week)

def news():
    url=requests.get("https://newsapi.org/v2/top-headlines?country=in&apiKey="+ con.news_apikey)
    data=json.loads(url.content)
    #extract top10 news title
    top_10= data['totalResults'] if data['totalResults']<10 else 10
    speak('news are as follows')
    for i in range(top_10):
        nws=data['articles'][i]['title']
        print(nws)
        speak(f'{nws}')

def weatherForcast(query):
    if 'in' in query:
        city=''.join(query.split('in')[1:])
    else:
        city=''.join(query.split('of')[1:])
    url=' http://api.weatherapi.com/v1/current.json?key='+con.weather_apikey +'&q='+city
    data=requests.get(url)
    data=data.json()
    value=data["current"]
    temp=value["temp_c"]
    if 'temperature' in query:
        print(f"{temp}°C")
        speak(f'temperature in {city} is {temp} degree celcius')
        return
    pressure=value["pressure_mb"]
    humidity=value["humidity"]
    desc=value['condition']['text']
    print(f'weather of {city} is as follows:-\n {desc}\ntemperature is {temp}°C\npressure is {pressure} mb and humidity is {humidity}%')
    speak(f'weather of {city} is as follows \
          {desc} temperature {temp} degree celcius pressure is {pressure} millibar and humidity is {humidity} percent')
    
    

if __name__ == "__main__":
    wishMe()
    while True:
    # if 1:
        query = takeCommand().lower()
        
        flag=0
        # Logic for executing tasks based on query 
        for site in con.sites:
            if f"open {site[0]}" in query:
             flag=1
             print(f"Assistant:opening {site[0]} sir")
             speak(f"opening {site[0]} sir")        
             webbrowser.open(site[1])
             break
             
        for que,ans in con.questions.items():
            if que in query:
                flag=1
                print(ans.strip())
                speak(ans)
                break

        if 'wikipedia' in query and flag==0:
            print("Assistant:Searching Wikipedia...")
            speak('Searching Wikipedia...')
            query = query.replace("wikipedia", "")
            results = wikipedia.summary(query, sentences=2)
            speak("According to Wikipedia")
            print(results)
            speak(results)

        elif 'play music' in query:
            music_dir = 'Music'
            songs = os.listdir(music_dir)
            print(songs)    
            os.startfile(os.path.join(music_dir, songs[0]))

        elif 'the time' in query:
            hour = datetime.datetime.now().strftime("%H")    
            min=datetime.datetime.now().strftime("%M")  
            print("Assistant:Sir, the time is "+ hour +" o clock and "+ min + " minutes")
            speak(f"Sir, the time is {hour} o clock and {min} minutes")

        elif 'day today' in query:
            tellDay()


        elif 'goodbye' in query:
            print("Assistant:Have a great day sir")
            speak('Have a great day sir')
            exit(0)
        
        elif 'news' in query or "current affairs" in query:
            news()
        
        elif 'temperature' in query or 'weather' in query:
            weatherForcast(query)
        
        elif 'using ai' in query:
            ai(query)
        
        elif flag!=1 and query!='none':
            chat(query)
