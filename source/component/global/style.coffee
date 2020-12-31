# function

@format = (data) ->

  result = []

  for key, value of data
    
    result.push "#{key.trim()}{"

    for k, v of value
      
      result.push "#{k}: #{v};"

    result.push '}'

  result.join '' # return

# export
export default

  computed:
    content: -> @format @data

  props:

    data:
      type: Object
      required: true