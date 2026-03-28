# FROM public.ecr.aws/lambda/python:3.10

# WORKDIR ${LAMBDA_TASK_ROOT}

# COPY requirements.txt .

# RUN pip install --upgrade pip

# # Use latest available version
# RUN pip install xgboost==3.0.5 --only-binary=:all:

# RUN pip install -r requirements.txt

# COPY . .

# CMD ["main.handler"]

FROM public.ecr.aws/lambda/python:3.10

WORKDIR ${LAMBDA_TASK_ROOT}

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["main.handler"]