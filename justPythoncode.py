from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import pandas as pd
from sklearn.metrics import r2_score
from numpy import mean
from sklearn.preprocessing import LabelEncoder
import numpy as np
from sklearn.ensemble import ExtraTreesClassifier
from scipy import stats
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

metrics=0
ir=0
ic=0
fr=0
fc=0
misscol=[]
missrow=0
duplirow=0
uniquecol={}
unimpcol=[]
bias={}
outrow=0
p=0
outcol=0



df=pd.read_csv("ride.csv")
var=pd.read_csv("ride.csv")
ir,ic=df.shape


#Removing missing values
df.replace(['-','non','?',''], np.nan,inplace=True)
p,q=df.shape
df_dropped=df.dropna(axis=1,thresh=p*0.9)

if df.shape[1]!=df_dropped.shape[1]:
    removed_columns = set(df.columns) - set(df_dropped.columns)
    misscol = list(removed_columns)
df.dropna(axis=1,thresh=p*0.9,inplace=True)
p,q=df.shape
df.dropna(inplace=True)
r,s=df.shape
missrow=p-r  

#Removing duplicates
df.drop_duplicates(inplace=True)
p,q=df.shape
duplirow=r-p


#Removing comlumns containing many unique values or very low unique values
X = df.iloc[:,0:-1]
y = df.iloc[:, -1]
result=df.nunique()
column_names = result.index.tolist()
values = result.values.tolist()

p,q=df.shape
threshold=0.9*p
lst=[]
for i in range(len(values)-1):
    if values[i]==1 or values[i]==2 or values[i]==3 or values[i]>threshold:
        lst.append(i)
        uniquecol.setdefault(X.columns[i],values[i])
for i in lst:
    df.drop([X.columns[i]],axis=1,inplace=True)
    
   
    
#Finding the importance of each feature to the target variable and removing the lesser important ones
c=df.columns
lb = LabelEncoder()
for i in range(len(c)):
    df[c[i]] = lb.fit_transform(df[c[i]])
    
model = ExtraTreesClassifier()
X = df.iloc[:,:-1].values
y = df.iloc[:, -1].values
model.fit(X,y)
feature=model.feature_importances_

a=mean(feature)*0.1
ll=[]
X = df.iloc[:,:-1]
for i,n in enumerate(feature):
    if n<a:
        ll.append(i)

for i in ll:
    unimpcol.append(X.columns[i])
    df.drop([X.columns[i]],axis=1,inplace=True)


#Remove outliers
df2 = df[~(np.abs(stats.zscore(df)) < 3.5).all(axis=1)]
df = df[(np.abs(stats.zscore(df)) < 3.5).all(axis=1)]
outrow,outcol=df2.shape
print(df2)


#Finding out the metrics
X = df.iloc[:,0:-1].values
y = df.iloc[:, -1].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.1, random_state = 3)
model=LinearRegression()
model.fit(X_train, y_train)
y_prediction = model.predict(X_test)
metrics=r2_score(y_test,y_prediction)

  
#Decoding
for col in df.columns:
    df[col]=var[col]
rows_to_delete = df[df.isin(df2)].dropna().index
df=df.drop(rows_to_delete)

fr,fc=df.shape

#Bias check

category_counts = df.iloc[:,-1].value_counts()
bias = category_counts / category_counts.sum() * 100
bias=dict(bias)


print("Initial size is",ir,"x",ic)
print("Final size is",fr,"x",fc)
print("The r2 score of a Linear regression model is ",metrics)
print("The columns that have multiple missing values are ",misscol)
print("No. of columns with missing values are ",missrow)
print("No. of duplicate rows are ",duplirow)
print("The unimportant columns are ",unimpcol)
print("The no. of outliers are",outrow)
print("The columns with less and most unique values",uniquecol)
print("The bias is ",bias)


output_file = 'outputride.csv'  # Specify the desired output file name and path

df.to_csv(output_file, index=False)





