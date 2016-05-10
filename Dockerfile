FROM ruby:2.2
MAINTAINER Pavan

RUN apt-get update && apt-get install -y \
  build-essential \
  nodejs

RUN mkdir -p /app
WORKDIR /app


COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install

# Copy the main application.
COPY . ./

# Expose port 3000 to the Docker host, so we can access it
EXPOSE 3000

# The main command to run when the container starts. Also
# tell the Rails dev server to bind to all interfaces by
# default.
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
