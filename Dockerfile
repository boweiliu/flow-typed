FROM node:10.8.0-stretch


RUN mkdir -p /root/flow-typed/
WORKDIR /root/flow-typed
COPY . ./
CMD /bin/bash

WORKDIR /root/flow-typed/definitions
RUN yarn install
RUN yarn test
WORKDIR /root/flow-typed/cli
RUN yarn
RUN yarn run flow
RUN node dist/cli.js validate-defs ../definitions
#RUN node dist/cli.js run-tests bluebird

#RUN bash /root/travis.sh
ENTRYPOINT ["node", "/root/flow-typed/cli/dist/cli.js", "run-tests" ]
CMD []
