'''
Here we are configuring the virtual assistant
Here we are declaring apikeys to get information like weather of a particular place or current affairs when user ask for the same from assistant also used
openai apikey to enhance the capability of assistant, 
sites names that user can ask assistant to visit(here only a few sites are mentioned but can be extended accordingly) 
and questions that user can ask to assistant along with the responses that the assistant will reply with(you can manipulate responses of assistant from here to
increase assistant's responsiveness)
'''
apikey="your openai apikey"
news_apikey="your news site apikey"
weather_apikey="your weather site apikey"
sites=[['youtube','youtube.com'],['google','google.com'],['wikipedia','wikipedia.com']]
questions={'your name':"I'm virtual assistant sir",'how was your day':'It was good sir, thankyou for asking',
                   'how are you':"I'm fine. You are very kind to ask",
                   'your birthday':"I was created in may 2023 so you can wish me in may every year",
                    'you created':'I was created in may 2023','your creator':'My creater is owner of this device',
                    'who created you':'My creater is owner of this device', 
                    "change your name":"I am sorry I can't to do so you can just call me virtual assitant",
                    "change name":"I am sorry I can't to do so you can just call me virtual assitant",
                    "can you do":" Here are a few things I can do for you:\n \
1. I can provide information on various topics, explain concepts, and clarify doubts you may have.\n \
2. Play music\n \
3. Tell current weather,day or date\n \
4. Tell you news\n \
5. Search anything in wikipedia,open different web sites or simply can chat with you",
                    "you can do":" Here are a few things I can do for you:\n \
1. I can provide information on various topics, explain concepts, and clarify doubts you may have.\n \
2. Play music\n \
3. Tell current weather,day or date\n \
4. Tell you news\n \
5. Search anything in wikipedia,open different web sites or simply can chat with you"
}
