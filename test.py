import json
  
# # Opening JSON file
# f = open('questions.json')
  
# # returns JSON object as 
# # a dictionary
# data = json.load(f)
  
# # Iterating through the json
# # list
# for i in data['questions']:
#     print(i)
#     break



question_num = {}

with open('ok2.json', encoding='utf-8-sig') as f:
    data = json.load(f)

# docs = open('ok2.json')

foods = data['foods'] 

for food in foods:
    print(food )
    # question_num['question']=all_questions[i].question
    
    # question_num['question'] = all_questions[i].question
    # question_num['A'] = all_questions[i].A 
    # question_num['B'] = all_questions[i].B 
    # question_num['C'] = all_questions[i].C 
    # question_num['D'] = all_questions[i].D 
    # question_num['num'] = i + 1

# Closing file
