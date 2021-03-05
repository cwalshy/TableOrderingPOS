# Portfolio

Work in progress Angular application to process drink orders    

All components are currently displayed on one page for simple prototyping  

## Currently:  

Users can scan QR Codes with url parameters e.g /table/40  

This passes the table number into the local storage of the device  

Once loaded users can add items (stored in a Firebase Database) to their cart 

Then users can checkout the items in their cart which redirects to Stripe Checkout  

Upon completion the stripe webhook saves the order into a seperate firebase collection which is displayed in another view  

The user is then redirected to a success page which clears the cart content and shows the current orders    


## Future 
Full overhall of UI  

Add log in functionality

Send order confirmation email on checkout completetion 

The order view will be able to view current orders and past orders  

Further admin functionality e.g. sales reporting for day/week/month


## Portfolio
requirements
envronments.ts file with firebase account


## To complete Backend and Webhook-backend

Requirements   
.env with the following values  
STRIPE_SECRET_KEY="xxx"  
STRIPE_PUBLIC_KEY="xxx"  
SERVICE_ACCOUNT_FILE_NAME="xxx"  
PROJECT_ID="xxx"   

service-accounts/  
with serviceaccountname.json  


## To init backend
Navigate to folder and run command "npm run server"
run the command "stripe listen --forward-to localhost:9000/hooks"

## init Portfolio
Navigate to folder and run command "npm run"
